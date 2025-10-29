import { Module } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { TokenModule } from '../token/token.module';
import { UserManagementController } from './user-management.controller';
import { UserManagementService } from './user-management.service';

@Module({
  imports: [TokenModule],
  controllers: [UserManagementController],
  providers: [UserManagementService, AuthService],
})
export class UserManagementModule {}
