import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  // IsOptional,
  // IsPhoneNumber,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
// import { Gender } from 'src/enums/gender.enum';
import { Role } from 'src/enums/role.enum';

export class CreateUserDto {
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

export class UpdateUserDto {
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
    example: Role.Admin,
    enum: Role,
  })
  @IsEnum(Role)
  role: Role;
}
