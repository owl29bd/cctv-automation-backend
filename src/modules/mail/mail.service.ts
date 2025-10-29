import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Role } from 'src/enums/role.enum';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async resetPassword(
    email: string,
    token: string,
    username: string = 'User',
  ): Promise<void> {
    return await this.mailerService.sendMail({
      to: email,
      subject: 'Reset your password',
      template: __dirname + '/templates/password-reset',
      context: {
        appName: this.configService.get<string>('APP_NAME'),
        username,
        frontendUrl:
          this.configService.get<string>('FRONTEND_RESET_PASSWORD_URL') + token,
      },
    });
  }

  async sendFamilyInvitationEmail(
    email: string,
    token: string,
    accountMakerEmail: string,
    role: string,
    username: string = 'User',
  ): Promise<void> {
    return await this.mailerService.sendMail({
      to: email,
      subject: 'Family invitation',
      template: __dirname + '/templates/password-set',
      context: {
        appName: this.configService.get<string>('APP_NAME'),
        username,
        accountMakerEmail,
        role,
        frontendUrl:
          this.configService.get<string>('FRONTEND_RESET_PASSWORD_URL') + token,
      },
    });
  }

  async sendAdminConfirmation(
    email: string,
    token: string,
    accountMakerEmail: string,
    role: string = Role.Admin,
    username: string = 'User',
  ): Promise<void> {
    return await this.mailerService.sendMail({
      to: email,
      subject: 'Account invitation',
      template: __dirname + '/templates/password-set',
      context: {
        appName: this.configService.get<string>('APP_NAME'),
        username,
        accountMakerEmail,
        role,
        frontendUrl:
          this.configService.get<string>('FRONTEND_RESET_PASSWORD_URL') + token,
      },
    });
  }
}
