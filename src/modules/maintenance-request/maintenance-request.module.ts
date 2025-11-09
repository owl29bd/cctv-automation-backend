import { Module } from '@nestjs/common';
import { CameraModule } from '../camera/camera.module';
import { MaintenanceRequestController } from './maintenance-request.controller';
import { MaintenanceRequestService } from './maintenance-request.service';

@Module({
  imports: [CameraModule],
  controllers: [MaintenanceRequestController],
  providers: [MaintenanceRequestService],
  exports: [MaintenanceRequestService],
})
export class MaintenanceRequestModule {}
