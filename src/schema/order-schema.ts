import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsOptional } from 'class-validator';
import { Document, Model, PaginateModel } from 'mongoose';
import * as paginate from 'mongoose-paginate-v2';

@Schema({ versionKey: false, timestamps: true })
export class Order extends Document {
  @Prop({
    type: String,
  })
  clientName: string;

  @Prop({
    required: false,
  })
  @IsOptional()
  // Object of keys and filename
  files?: OrderFile[];

  @Prop({
    type: String,
  })
  remarks: string;

  @Prop({
    type: Date,
    required: false,
  })
  @IsOptional()
  dueDate?: Date;
}

export interface OrderFile {
  name: string;
  key: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
OrderSchema.plugin(paginate);
OrderSchema.loadClass(Order);

export interface OrderModel extends Model<Order>, PaginateModel<Order> {}
