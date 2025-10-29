import { Expose, Type } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from './base.res';
import { Gender } from 'src/enums/gender.enum';
import { PaginatedResponse } from './paginated.res';
import { Role } from 'src/enums/role.enum';
import { UserStatus } from 'src/enums/status.enum';

export class UserResponse extends BaseResponse {
  @ApiProperty()
  @Expose()
  firstName: string;

  @ApiProperty()
  @Expose()
  lastName: string;

  @ApiProperty()
  @Expose()
  get name() {
    if (!this.firstName || !this.lastName) return null;

    return this.firstName + ' ' + this.lastName;
  }

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  phone: string;

  @ApiProperty({ enum: Gender })
  @Expose()
  gender: Gender;

  @ApiProperty()
  @Expose()
  profileImage: string;

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

export class PaginatedUserResponse extends PaginatedResponse<UserResponse> {
  @ApiProperty({ type: [UserResponse] })
  @Type(() => UserResponse)
  data: UserResponse[];
}
