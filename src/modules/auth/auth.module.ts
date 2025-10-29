import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MailModule } from '../mail/mail.module';
import { Module } from '@nestjs/common';
import { TokenModule } from '../token/token.module';

@Module({
  imports: [MailModule, TokenModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
