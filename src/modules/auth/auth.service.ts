import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ForgotPasswordDto,
  GoogleLoginDto,
  LoginDto,
  RefreshTokenDto,
  RegisterDto,
  ResetPasswordDto,
} from 'src/dtos/requests/auth.dto';
import { UserStatus } from 'src/enums/status.enum';
import { User, UserModel } from 'src/schema/user.schema';
import { TokenService } from '../token/token.service';

@Injectable()
export class AuthService {
  constructor(
    private tokenService: TokenService,
    @InjectModel(User.name) private userModel: UserModel,
  ) {}

  async register(registerDto: RegisterDto) {
    if (await this.userModel.isEmailTaken(registerDto.email)) {
      throw new HttpException('Email already taken', HttpStatus.CONFLICT);
    }

    const user = await this.userModel.create({
      ...registerDto,
      status: [UserStatus.Active],
    });

    const tokens = await this.tokenService.getAuthTokens(
      user.id,
      user.email,
      user.role,
    );

    return { user, tokens };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userModel.findOne({
      email: loginDto.email,
    });

    if (!user)
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);

    if (user.status.includes(UserStatus.PasswordMissing))
      throw new HttpException(
        'Password missing. Please reset password',
        HttpStatus.UNAUTHORIZED,
      );

    const isPasswordValid = await user.validatePassword(loginDto.password);

    if (!isPasswordValid)
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);

    const tokens = await this.tokenService.getAuthTokens(
      user.id,
      user.email,
      user.role,
    );

    return { user, tokens };
  }

  async googleLogin(googleLoginDto: GoogleLoginDto) {
    let user = await this.userModel.findOne({
      email: googleLoginDto.email,
    });

    if (user && !user.oAuthId) {
      user.oAuthId = googleLoginDto.oAuthId;

      user.status = user.status.filter(
        (status) => status !== UserStatus.PasswordMissing,
      );

      await user.save();
    }

    if (!user) {
      user = await this.userModel.create({
        ...googleLoginDto,
        status: [UserStatus.Onboarding],
      });
    }

    const tokens = await this.tokenService.getAuthTokens(
      user.id,
      user.email,
      user.role,
    );

    return { user, tokens };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const payload = await this.tokenService.verifyRefreshToken(
      refreshTokenDto.token,
    );

    const user = await this.userModel.findById(payload.sub);

    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const tokens = await this.tokenService.getAuthTokens(
      user.id,
      user.email,
      user.role,
    );

    return { user, tokens };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.userModel.findOne({
      email: forgotPasswordDto.email,
    });

    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const resetToken = await this.tokenService.getPasswordResetToken(
      user.id,
      user.email,
      user.password,
    );

    // await this.mailService.resetPassword(user.email, resetToken, user.fullName);

    return { user, resetToken };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const payload = await this.tokenService.verifyPasswordResetToken(
      resetPasswordDto.token,
    );

    const user = await this.userModel.findById(payload.sub);

    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    if (payload.reuseChecker !== user.password)
      throw new HttpException(
        'Token has been invalidated',
        HttpStatus.UNAUTHORIZED,
      );

    user.password = resetPasswordDto.newPassword;

    user.status = user.status.filter(
      (status) => status !== UserStatus.PasswordMissing,
    );

    await user.save();

    return user;
  }
}
