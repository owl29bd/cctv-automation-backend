import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { CameraStatus } from 'src/enums/camera-status.enum';
import { BaseResponse } from './base.res';
import { PaginatedResponse } from './paginated.res';

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

  @ApiProperty()
  @Expose()
  ip: string;

  @ApiProperty()
  @Expose()
  serialNumber: string;

  @ApiProperty({ required: false })
  @Expose()
  image?: string; // Base64 encoded image

  @ApiProperty({ required: false })
  @Expose()
  imageContentType?: string;

  @ApiProperty({ enum: CameraStatus })
  @Expose()
  status: CameraStatus;
}

export class PaginatedCameraResponse extends PaginatedResponse<CameraResponse> {
  @ApiProperty({ type: [CameraResponse] })
  @Type(() => CameraResponse)
  data: CameraResponse[];
}
