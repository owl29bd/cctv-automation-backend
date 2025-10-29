import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { BaseResponse } from './base.res';
import { GroupType } from 'src/enums/group-type.enum';
import { UserResponse } from './user.res';
import { PaginatedResponse } from './paginated.res';

export class UserGroupResponse extends BaseResponse {
  @ApiProperty()
  @Expose()
  groupName: string;

  @ApiProperty({ enum: GroupType })
  @Expose()
  groupType: GroupType;

  @ApiProperty({ type: UserResponse })
  @Expose()
  @Type(() => UserResponse)
  groupLeader: UserResponse;

  @ApiProperty({ type: [UserResponse] })
  @Expose()
  @Type(() => UserResponse)
  groupMembers: UserResponse[];
}

export class PaginatedUserGroupResponse extends PaginatedResponse<UserGroupResponse> {
  @ApiProperty({ type: [UserGroupResponse] })
  @Type(() => UserGroupResponse)
  data: UserGroupResponse[];
}
