import { Global, Module } from '@nestjs/common';
import { User, UserSchema } from './user.schema';
import { Camera, CameraSchema } from './camera.schema';
import { MaintenanceRequest, MaintenanceRequestSchema } from './maintenance-request.schema';

import { MongooseModule } from '@nestjs/mongoose';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Camera.name,
        schema: CameraSchema,
      },
      {
        name: MaintenanceRequest.name,
        schema: MaintenanceRequestSchema,
      },
    ]),
  ],
  exports: [MongooseModule],
})
export class SchemaModule {}
