import { Module } from '@nestjs/common';
import { MaintenanceRequestController } from './maintenance-request.controller';
import { MaintenanceRequestService } from './maintenance-request.service';

@Module({
  controllers: [MaintenanceRequestController],
  providers: [MaintenanceRequestService],
  exports: [MaintenanceRequestService],
})
export class MaintenanceRequestModule {}

