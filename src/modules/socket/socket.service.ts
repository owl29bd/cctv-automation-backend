import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createServer as createHttpServer, Server as HttpServer } from 'http';
import { Socket, Server as SocketIOServer } from 'socket.io';
import { ConnectionManagerService } from './connection-manager.service';
import { IMessage } from './message.dto';
import {
  IActiveUser,
  ISocketConfig,
  ISocketService,
} from './socket.interfaces';

@Injectable()
export class SocketService
  implements ISocketService, OnModuleInit, OnModuleDestroy
{
  private httpServer: HttpServer;
  private io: SocketIOServer;
  private readonly socketConfig: ISocketConfig;
  private isInitialized: boolean = false;

  constructor(
    private connectionManager: ConnectionManagerService,
    private configService: ConfigService,
  ) {
    this.socketConfig = {
      cors: {
        origin: [
          process.env.FRONTEND_URL || 'http://localhost:3000',
          'http://localhost:3000',
        ],
        methods: ['GET', 'POST'],
        credentials: true,
      },
      transports: ['polling', 'websocket'],
      pingTimeout: 60000,
      pingInterval: 25000,
      allowUpgrades: true,
    };
  }

  async onModuleInit() {
    await this.initialize();
  }

  async onModuleDestroy(): Promise<void> {
    if (this.httpServer) {
      await new Promise<void>((resolve) => {
        this.httpServer.close(() => {
          console.log('HTTP Server closed');
          resolve();
        });
      });
    }
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      this.httpServer = createHttpServer();
      this.setupSocketServer();
      this.handleSocketConnections();
      await this.startHttpServer();
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize socket communication:', error);
      throw error;
    }
  }

  // #region Private Methods

  private setupSocketServer(): void {
    this.io = new SocketIOServer(this.httpServer, this.socketConfig);
  }

  private handleSocketConnections(): void {
    this.io.on('connection', (socket: Socket) => {
      console.log(`Client Connected: ${socket.id}`);

      const user: IActiveUser = {
        socketId: socket.id,
        userId: 'pending',
        lastActivity: new Date(),
        reconnectAttempts: 0,
      };

      this.connectionManager.registerUser(user);
      socket.emit('connected', { socketId: socket.id });

      // Handle user ID registration
      socket.on('register', (userId: string) => {
        this.handleUserRegistration(socket, userId);
      });

      // Handle ping for connection health
      socket.on('ping', () => {
        this.connectionManager.updateUserActivity(socket.id);
        socket.emit('pong');
      });

      // Handle any custom message
      socket.on('message', (data: any) => {
        this.connectionManager.updateUserActivity(socket.id);
        // Handle custom messages here if needed
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        this.handleDisconnection(socket);
      });
    });
  }

  private handleUserRegistration(socket: Socket, userId: string): void {
    try {
      const existingUser = this.connectionManager.getUserBySocketId(socket.id);
      if (existingUser) {
        // Update user ID
        const updatedUser: IActiveUser = {
          ...existingUser,
          userId,
          lastActivity: new Date(),
          reconnectAttempts: 0,
        };
        this.connectionManager.removeUser(socket.id);
        this.connectionManager.registerUser(updatedUser);
        socket.emit('registered', { userId });
      }
    } catch (error) {
      console.error(`Error registering user: ${error.message}`);
      socket.emit('error', { message: 'Failed to register user' });
    }
  }

  private handleDisconnection(socket: Socket): void {
    const user = this.connectionManager.getUserBySocketId(socket.id);
    if (user) {
      console.log(`Client Disconnected: ${socket.id} (User: ${user.userId})`);
      this.connectionManager.removeUser(socket.id);
    }
  }

  private async startHttpServer(): Promise<void> {
    const PORT = this.configService.get<number>('SOCKET_PORT') || 8080;

    if (this.httpServer.listening) {
      console.log(`HTTP Server already running on port ${PORT}`);
      return;
    }

    return new Promise((resolve, reject) => {
      try {
        this.httpServer.listen(PORT, () => {
          console.log(`Socket Server started on port ${PORT}`);
          resolve();
        });
      } catch (error) {
        console.error(`Error starting HTTP Server: ${error.message}`);
        reject(error);
      }
    });
  }

  // #endregion

  // #region Public Methods

  async sendToUser(userId: string, message: IMessage): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('Socket service not initialized');
    }

    const user = this.connectionManager.getUserByUserId(userId);
    if (!user) {
      console.warn(`User not found: ${userId}`);
      return;
    }

    try {
      this.io.to(user.socketId).emit('message', message);
      this.connectionManager.updateUserActivity(user.socketId);
    } catch (error) {
      console.error(
        `Error sending message to user ${userId}: ${error.message}`,
      );
      throw error;
    }
  }

  async broadcast(message: IMessage): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('Socket service not initialized');
    }

    try {
      this.io.emit('broadcast', message);
    } catch (error) {
      console.error(`Error broadcasting message: ${error.message}`);
      throw error;
    }
  }

  isActiveUser(userId: string): boolean {
    return this.connectionManager.isUserActive(userId);
  }

  getActiveUserCount(): number {
    return this.connectionManager.getActiveUserCount();
  }
}
