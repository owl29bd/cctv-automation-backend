import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ReportStatus } from 'src/enums/report-status.enum';
import { PaginatedResponse } from './paginated.res';

export class StagingResponse {
  @ApiProperty()
  @Expose()
  profileId: string;

  @ApiProperty()
  @Expose()
  reportId: string;

  @ApiProperty({ enum: ReportStatus })
  @Expose()
  reportStatus: string;
}

export class PaginatedStagingResponse extends PaginatedResponse<StagingResponse> {
  @ApiProperty({ type: [StagingResponse] })
  @Type(() => StagingResponse)
  data: StagingResponse[];
}
