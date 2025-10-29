import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async getAuthTokens(userId: string, email: string, role: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.getAccessToken(userId, email, role),
      this.getRefreshToken(userId, email, role),
    ]);

    const tokens = {
      accessToken,
      refreshToken,
      expiresIn: new Date().setTime(
        new Date().getTime() +
          Number(this.configService.get('ACCESS_TOKEN_EXPIRATION_TIME')),
      ),
    };

    return tokens;
  }

  async getAccessToken(userId: string, email: string, role: string) {
    return this.jwtService.signAsync(
      { sub: userId, email, role },
      {
        secret: this.configService.get('ACCESS_TOKEN_SECRET'),
        expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRATION_TIME'),
      },
    );
  }

  async getRefreshToken(userId: string, email: string, role: string) {
    return this.jwtService.signAsync(
      { sub: userId, email, role },
      {
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
        expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRATION_TIME'),
      },
    );
  }

  async getPasswordResetToken(userId: string, email: string, password: string) {
    return await this.jwtService.signAsync(
      { sub: userId, email, reuseChecker: password },
      {
        secret: this.configService.get('RESET_TOKEN_SECRET'),
        expiresIn: this.configService.get('RESET_TOKEN_EXPIRATION_TIME'),
      },
    );
  }

  async verifyAccessToken(token: string) {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      });
    } catch (error) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }

  async verifyRefreshToken(token: string) {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      });
    } catch (error) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }

  async verifyPasswordResetToken(token: string) {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('RESET_TOKEN_SECRET'),
      });
    } catch (error) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }
}
