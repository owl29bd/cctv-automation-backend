import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Role } from 'src/enums/role.enum';

export class LoginDto {
  @ApiProperty({
    example: 'john.doe@email.com',
  })
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @ApiProperty({
    example: 'admin123',
  })
  @IsNotEmpty()
  password: string;
}

export class RegisterDto {
  @ApiProperty({
    example: 'User',
  })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    example: 'User',
  })
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    example: 'john.doe@email.com',
  })
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @ApiProperty({
    example: 'admin123',
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: Role.Admin,
    enum: Role,
  })
  @IsEnum(Role)
  role: Role;
}

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'john.doe@email.com',
  })
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    example: 'admin123',
  })
  @IsNotEmpty()
  newPassword: string;
}

export class GoogleLoginDto {
  @ApiProperty()
  @IsNotEmpty()
  oAuthId: string;

  @ApiProperty({
    example: 'john.doe@email.com',
  })
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @ApiProperty({
    example: 'Google',
  })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    example: 'User',
  })
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  profileImage: string;
}

export class RefreshTokenDto {
  @ApiProperty()
  @IsNotEmpty()
  token: string;
}
