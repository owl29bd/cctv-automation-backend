import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CameraModule } from '../camera/camera.module';
import { PingService } from './ping.service';

@Module({
  imports: [ScheduleModule.forRoot(), CameraModule],
  providers: [PingService],
  exports: [PingService],
})
export class PingModule {}
