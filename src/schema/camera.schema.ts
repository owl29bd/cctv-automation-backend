import * as paginate from 'mongoose-paginate-v2';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model, PaginateModel } from 'mongoose';
import { CameraStatus } from 'src/enums/camera-status.enum';

@Schema({ versionKey: false, timestamps: true })
export class Camera extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  ip: string;

  @Prop({ required: true })
  serialNumber: string;

  @Prop({ type: Buffer })
  image: Buffer;

  @Prop()
  imageContentType: string; // e.g., 'image/jpeg', 'image/png'

  @Prop({
    type: String,
    enum: CameraStatus,
    default: CameraStatus.Online,
  })
  status: CameraStatus;
}

export const CameraSchema = SchemaFactory.createForClass(Camera);

CameraSchema.plugin(paginate);

CameraSchema.loadClass(Camera);

export interface CameraModel extends Model<Camera>, PaginateModel<Camera> {}
