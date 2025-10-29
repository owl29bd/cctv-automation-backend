import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ReportLevel } from 'src/enums/report-level.enum';
import { ReportStatus } from 'src/enums/report-status.enum';
import { BaseResponse } from './base.res';
import { OrderManagementResponse } from './order-management.res';
import { PaginatedResponse } from './paginated.res';
import { ProfileResponse } from './profile.res';
import { UserResponse } from './user.res';

export class ReportResponse extends BaseResponse {
  @ApiProperty()
  @Expose()
  @Type(() => ProfileResponse)
  profileId: ProfileResponse;

  @ApiProperty({ enum: ReportLevel })
  @Expose()
  reportLevel: ReportLevel;

  @ApiProperty({ type: [Object] })
  @Expose()
  details: Object[];

  @ApiProperty({ enum: ReportStatus })
  @Expose()
  status: ReportStatus;

  @ApiProperty()
  @Expose()
  feedback: string;

  @ApiProperty()
  @Expose()
  @Type(() => OrderManagementResponse)
  orderId: OrderManagementResponse;

  @ApiProperty()
  @Expose()
  @Type(() => UserResponse)
  submittedBy: UserResponse;
}

export class PaginatedReportResponse extends PaginatedResponse<ReportResponse> {
  @ApiProperty({ type: [ReportResponse] })
  @Type(() => ReportResponse)
  data: ReportResponse[];
}
