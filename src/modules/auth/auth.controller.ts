import { Body, Catch, Controller, Post, Put, Res } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  LoginDto,
  RegisterDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  RefreshTokenDto,
  GoogleLoginDto,
} from 'src/dtos/requests/auth.dto';
import { Public } from 'src/decorators/auth.decorator';
import { AuthResponse } from 'src/dtos/responses/auth.res';
import { plainToInstance } from 'class-transformer';

@Catch()
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({ type: AuthResponse })
  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto);
    return plainToInstance(AuthResponse, result, { enableCircularCheck: true });
  }

  @ApiResponse({ type: AuthResponse })
  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const result = await this.authService.register(registerDto);
    return plainToInstance(AuthResponse, result);
  }

  @ApiResponse({ type: AuthResponse })
  @Public()
  @Post('google-login')
  async googleLogin(@Body() googleLoginDto: GoogleLoginDto) {
    const result = await this.authService.googleLogin(googleLoginDto);
    return plainToInstance(AuthResponse, result, { enableCircularCheck: true });
  }

  @ApiResponse({ type: AuthResponse })
  @Public()
  @Post('refresh-token')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    const result = await this.authService.refreshToken(refreshTokenDto);
    return plainToInstance(AuthResponse, result, { enableCircularCheck: true });
  }

  @Public()
  @Post('forgot-password')
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
    @Res() res: any,
  ) {
    const result = await this.authService.forgotPassword(forgotPasswordDto);
    return res.status(200).send(result);
  }

  @Public()
  @Put('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Res() res: any,
  ) {
    const result = await this.authService.resetPassword(resetPasswordDto);
    return res.status(200).send(result);
  }
}
