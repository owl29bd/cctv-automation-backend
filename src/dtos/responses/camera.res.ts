import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from './base.res';
import { PaginatedResponse } from './paginated.res';
import { CameraStatus } from 'src/enums/camera-status.enum';

export class CameraResponse extends BaseResponse {
  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  location: string;

  @ApiProperty({ enum: CameraStatus })
  @Expose()
  status: CameraStatus;
}

export class PaginatedCameraResponse extends PaginatedResponse<CameraResponse> {
  @ApiProperty({ type: [CameraResponse] })
  @Type(() => CameraResponse)
  data: CameraResponse[];
}

