import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { IActiveUser, IConnectionManager } from './socket.interfaces';

@Injectable()
export class ConnectionManagerService
  implements IConnectionManager, OnModuleInit, OnModuleDestroy
{
  private activeUsers: Map<string, IActiveUser> = new Map();
  private userSocketMap: Map<string, string> = new Map();
  private readonly healthCheckInterval: number = 60000; // 60 seconds
  private readonly maxReconnectAttempts: number = 10;
  private healthCheckIntervalId: NodeJS.Timeout;

  onModuleInit() {
    this.startHealthCheck();
  }

  onModuleDestroy() {
    this.stopHealthCheck();
  }

  private startHealthCheck(): void {
    this.healthCheckIntervalId = setInterval(() => {
      this.checkConnections().catch((error) => {
        console.error(`Health check failed: ${error.message}`);
      });
    }, this.healthCheckInterval);
  }

  private stopHealthCheck(): void {
    if (this.healthCheckIntervalId) {
      clearInterval(this.healthCheckIntervalId);
    }
  }

  private async checkConnections(): Promise<void> {
    const now = new Date();
    for (const [socketId, user] of this.activeUsers.entries()) {
      const inactiveTime = now.getTime() - user.lastActivity.getTime();
      if (inactiveTime > this.healthCheckInterval) {
        // Mark as potentially unhealthy, but don't remove immediately
        // Let the socket disconnect event handle removal
        console.warn(
          `Inactive connection detected for user ${user.userId} (${inactiveTime}ms)`,
        );
      }
    }
  }

  registerUser(user: IActiveUser): void {
    try {
      this.activeUsers.set(user.socketId, user);
      this.userSocketMap.set(user.userId, user.socketId);
    } catch (error) {
      console.error(`Failed to register user ${user.userId}: ${error.message}`);
      throw error;
    }
  }

  removeUser(socketId: string): void {
    try {
      const user = this.activeUsers.get(socketId);
      if (user) {
        this.activeUsers.delete(socketId);
        this.userSocketMap.delete(user.userId);
      }
    } catch (error) {
      console.error(
        `Failed to remove user with socket ${socketId}: ${error.message}`,
      );
    }
  }

  getUserBySocketId(socketId: string): IActiveUser | undefined {
    return this.activeUsers.get(socketId);
  }

  getUserByUserId(userId: string): IActiveUser | undefined {
    const socketId = this.userSocketMap.get(userId);
    return socketId ? this.activeUsers.get(socketId) : undefined;
  }

  getAllUsers(): IActiveUser[] {
    return Array.from(this.activeUsers.values());
  }

  isUserActive(userId: string): boolean {
    return this.userSocketMap.has(userId);
  }

  getActiveUserCount(): number {
    return this.activeUsers.size;
  }

  updateUserActivity(socketId: string): void {
    const user = this.activeUsers.get(socketId);
    if (user) {
      user.lastActivity = new Date();
      // Reset reconnect attempts on activity
      if (user.reconnectAttempts && user.reconnectAttempts > 0) {
        user.reconnectAttempts = 0;
      }
    }
  }

  incrementReconnectAttempts(socketId: string): void {
    const user = this.activeUsers.get(socketId);
    if (user) {
      user.reconnectAttempts = (user.reconnectAttempts || 0) + 1;
      if (user.reconnectAttempts > this.maxReconnectAttempts) {
        console.warn(
          `Max reconnect attempts reached for user ${user.userId}, removing connection`,
        );
        this.removeUser(socketId);
      }
    }
  }
}
