import * as paginate from 'mongoose-paginate-v2';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  Document,
  Model,
  PaginateModel,
  Schema as MongooseSchema,
} from 'mongoose';
import { Order } from './order-schema';

@Schema({ versionKey: false, timestamps: true })
export class Profile extends Document {
  @Prop({
    type: String,
  })
  name: string;

  @Prop({
    type: String,
  })
  email: string;

  @Prop({
    type: String,
  })
  phone: string;

  @Prop({
    type: String,
  })
  address: string;

  @Prop({
    type: String,
  })
  details: string;

  @Prop({
    type: [Object],
  })
  remarks: Object[];

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: Order.name,
    required: true,
  })
  orderId: Order;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);

ProfileSchema.plugin(paginate);
ProfileSchema.loadClass(Profile);

export interface ProfileModel extends Model<Profile>, PaginateModel<Profile> {}
