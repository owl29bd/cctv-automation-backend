import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConnectionManagerService } from './connection-manager.service';
import { SocketService } from './socket.service';

@Module({
  imports: [ConfigModule],
  providers: [SocketService, ConnectionManagerService],
  exports: [SocketService],
})
export class SocketModule {}
