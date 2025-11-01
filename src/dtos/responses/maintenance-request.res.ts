import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from './base.res';
import { PaginatedResponse } from './paginated.res';
import { MaintenanceRequestStatus } from 'src/enums/maintenance-request-status.enum';
import { CameraResponse } from './camera.res';

export class MaintenanceRequestResponse extends BaseResponse {
  @ApiProperty({ type: CameraResponse })
  @Expose()
  @Type(() => CameraResponse)
  camera: CameraResponse;

  @ApiProperty({ enum: MaintenanceRequestStatus })
  @Expose()
  status: MaintenanceRequestStatus;

  @ApiProperty({ type: Date })
  @Expose()
  requestDate: Date;

  @ApiProperty({ type: Date, required: false })
  @Expose()
  acceptedDate?: Date;

  @ApiProperty({ type: Date, required: false })
  @Expose()
  verificationRequestDate?: Date;

  @ApiProperty({ required: false })
  @Expose()
  notes?: string;

  @ApiProperty()
  @Expose()
  serviceProviderId: string;

  @ApiProperty()
  @Expose()
  administratorId: string;
}

export class PaginatedMaintenanceRequestResponse extends PaginatedResponse<MaintenanceRequestResponse> {
  @ApiProperty({ type: [MaintenanceRequestResponse] })
  @Type(() => MaintenanceRequestResponse)
  data: MaintenanceRequestResponse[];
}

