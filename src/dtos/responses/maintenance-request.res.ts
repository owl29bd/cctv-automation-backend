import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { MaintenanceRequestStatus } from 'src/enums/maintenance-request-status.enum';
import { BaseResponse } from './base.res';
import { CameraResponse } from './camera.res';
import { PaginatedResponse } from './paginated.res';
import { UserResponse } from './user.res';

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

  @ApiProperty({ required: false })
  @Expose()
  feedback?: string;

  @ApiProperty()
  @Expose()
  @Transform(({ obj }) => {
    // If serviceProviderId is populated (object), extract the ID
    if (obj.serviceProviderId && typeof obj.serviceProviderId === 'object') {
      return (
        obj.serviceProviderId._id?.toString() ||
        obj.serviceProviderId.id?.toString() ||
        obj.serviceProviderId
      );
    }
    return obj.serviceProviderId?.toString() || obj.serviceProviderId || '';
  })
  serviceProviderId: string;

  @ApiProperty({ type: UserResponse, required: false })
  @Expose()
  @Transform(({ obj }) => {
    // If serviceProviderId is populated (object), map it to serviceProvider
    if (obj.serviceProviderId && typeof obj.serviceProviderId === 'object') {
      return obj.serviceProviderId;
    }
    return obj.serviceProvider || null;
  })
  @Type(() => UserResponse)
  serviceProvider?: UserResponse;

  @ApiProperty()
  @Expose()
  administratorId: string;
}

export class PaginatedMaintenanceRequestResponse extends PaginatedResponse<MaintenanceRequestResponse> {
  @ApiProperty({ type: [MaintenanceRequestResponse] })
  @Type(() => MaintenanceRequestResponse)
  data: MaintenanceRequestResponse[];
}
