import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model, PaginateModel } from 'mongoose';
import * as paginate from 'mongoose-paginate-v2';

@Schema({ versionKey: false, timestamps: true })
export class Feedback extends Document {
  @Prop({
    type: String,
  })
  clientName: string;

  @Prop({
    type: String,
  })
  email: string;

  @Prop({
    type: String,
  })
  type: string;

  @Prop({
    type: String,
  })
  details: string;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);
FeedbackSchema.plugin(paginate);
FeedbackSchema.loadClass(Feedback);

export interface FeedbackModel
  extends Model<Feedback>,
    PaginateModel<Feedback> {}
