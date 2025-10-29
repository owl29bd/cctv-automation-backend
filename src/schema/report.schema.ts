import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  Document,
  Model,
  Schema as MongooseSchema,
  PaginateModel,
} from 'mongoose';
import * as paginate from 'mongoose-paginate-v2';
import { Profile } from './profile.schema';
import { ReportLevel } from 'src/enums/report-level.enum';
import { ReportStatus } from 'src/enums/report-status.enum';
import { Order } from './order-schema';
import { User } from './user.schema';

@Schema({ versionKey: false, timestamps: true })
export class Report extends Document {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: Profile.name,
    required: true,
  })
  profileId: Profile;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  submittedBy: User;

  @Prop({
    type: String,
    enum: ReportLevel,
  })
  reportLevel: string;

  @Prop({
    type: [Object],
  })
  details: Object[];

  @Prop({
    type: String,
    enum: ReportStatus,
  })
  status: string;

  @Prop({
    type: String,
  })
  feedback: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: Order.name,
    required: true,
  })
  orderId: Order;
}

export const ReportSchema = SchemaFactory.createForClass(Report);
ReportSchema.plugin(paginate);
ReportSchema.loadClass(Report);

export interface ReportModel extends Model<Report>, PaginateModel<Report> {}
