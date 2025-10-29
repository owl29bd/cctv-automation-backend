import { Expose, Type } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from './base.res';
import { Role } from 'src/enums/role.enum';
import { UserStatus } from 'src/enums/status.enum';

class TokenResponse {
  @ApiProperty()
  @Expose()
  accessToken: string;

  @ApiProperty()
  @Expose()
  refreshToken: string;

  @ApiProperty()
  @Expose()
  @Type(() => Number)
  expiresIn: number;
}

class UserResponse extends BaseResponse {
  @ApiProperty()
  @Expose()
  firstName: string;

  @ApiProperty()
  @Expose()
  lastName: string;

  @ApiProperty()
  @Expose()
  get name() {
    return this.firstName + ' ' + this.lastName;
  }

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  profileImage?: string;

  @ApiProperty({ enum: Role })
  @Expose()
  role: Role;

  @ApiProperty({
    enum: UserStatus,
    isArray: true,
  })
  @Expose()
  status: UserStatus[];
}

export class AuthResponse {
  @ApiProperty()
  @Expose()
  @Type(() => UserResponse)
  user: UserResponse;

  @ApiProperty()
  @Expose()
  @Type(() => TokenResponse)
  tokens: TokenResponse;
}
