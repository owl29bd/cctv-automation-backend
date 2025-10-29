import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { BaseResponse } from './base.res';
import { PaginatedResponse } from './paginated.res';
import { OrderManagementResponse } from './order-management.res';

export class ProfileResponse extends BaseResponse {
  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  phone: string;

  @ApiProperty()
  @Expose()
  address: string;

  @ApiProperty()
  @Expose()
  details: string;

  @ApiProperty({type: [Object]})
  @Expose()
  remarks: Object[];

  @ApiProperty()
  @Expose()
  @Type(() => OrderManagementResponse)
  orderId: OrderManagementResponse;
}

export class PaginatedProfileResponse extends PaginatedResponse<ProfileResponse> {
  @ApiProperty({ type: [ProfileResponse] })
  @Type(() => ProfileResponse)
  data: ProfileResponse[];
}

// shanto
export class SiProfileResponse extends ProfileResponse {
  @ApiProperty()
  @Expose()
  numberOfTasks: number;

  @ApiProperty()
  @Expose()
  numberOfReports: number;

  @ApiProperty()
  @Expose()
  status: string;
}

export class PaginatedSiProfileResponse extends PaginatedResponse<SiProfileResponse> {
  @ApiProperty({ type: [SiProfileResponse] })
  @Type(() => SiProfileResponse)
  data: SiProfileResponse[];
}
