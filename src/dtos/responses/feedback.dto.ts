import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { BaseResponse } from './base.res';
import { PaginatedResponse } from './paginated.res';

export class FeedbackResponse extends BaseResponse {
  @ApiProperty()
  @Expose()
  clientName: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  type: string;

  @ApiProperty()
  @Expose()
  details: string;
}

export class PaginatedFeedbackResponse extends PaginatedResponse<FeedbackResponse> {
  @ApiProperty({ type: [FeedbackResponse] })
  @Type(()=> FeedbackResponse)
  data: FeedbackResponse[];
}
