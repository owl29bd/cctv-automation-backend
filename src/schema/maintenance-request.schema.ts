import * as paginate from 'mongoose-paginate-v2';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model, PaginateModel, Types } from 'mongoose';
import { MaintenanceRequestStatus } from 'src/enums/maintenance-request-status.enum';

@Schema({ versionKey: false, timestamps: true })
export class MaintenanceRequest extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Camera', required: true })
  camera: Types.ObjectId;

  @Prop({
    type: String,
    enum: MaintenanceRequestStatus,
    default: MaintenanceRequestStatus.Pending,
  })
  status: MaintenanceRequestStatus;

  @Prop({ type: Date, required: true, default: Date.now })
  requestDate: Date;

  @Prop({ type: Date })
  acceptedDate?: Date;

  @Prop({ type: Date })
  verificationRequestDate?: Date;

  @Prop()
  notes?: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  serviceProviderId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  administratorId: Types.ObjectId;
}

export const MaintenanceRequestSchema =
  SchemaFactory.createForClass(MaintenanceRequest);

MaintenanceRequestSchema.plugin(paginate);

MaintenanceRequestSchema.loadClass(MaintenanceRequest);

export interface MaintenanceRequestModel
  extends Model<MaintenanceRequest>,
    PaginateModel<MaintenanceRequest> {}

