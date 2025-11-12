import { IMessage } from './message.dto';

export interface IActiveUser {
  socketId: string;
  userId: string;
  lastActivity: Date;
  reconnectAttempts?: number;
}

export interface ISocketConfig {
  cors: {
    origin: string[];
    methods: string[];
    credentials: boolean;
  };
  transports: ('websocket' | 'polling')[];
  pingTimeout: number;
  pingInterval: number;
  allowUpgrades?: boolean;
}

export interface ISocketService {
  initialize(): Promise<void>;
  sendToUser(userId: string, message: IMessage): Promise<void>;
  broadcast(message: IMessage): Promise<void>;
  isActiveUser(userId: string): boolean;
  getActiveUserCount(): number;
}

export interface IConnectionManager {
  registerUser(user: IActiveUser): void;
  removeUser(socketId: string): void;
  getUserBySocketId(socketId: string): IActiveUser | undefined;
  getUserByUserId(userId: string): IActiveUser | undefined;
  getAllUsers(): IActiveUser[];
  isUserActive(userId: string): boolean;
  getActiveUserCount(): number;
  updateUserActivity(socketId: string): void;
}
