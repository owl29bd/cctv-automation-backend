import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  Document,
  Model,
  Schema as MongooseSchema,
  PaginateModel,
} from 'mongoose';

import * as paginate from 'mongoose-paginate-v2';
import { Profile } from './profile.schema';
import { TaskType } from 'src/enums/task-type.enum';
import { User } from './user.schema';
import { Report } from './report.schema';
import { IsOptional } from 'class-validator';
import { TaskStatus } from 'src/enums/task-status.enum';
import { Order } from './order-schema';

@Schema({ versionKey: false, timestamps: true })
export class Task extends Document {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: Profile.name,
    required: true,
  })
  profileId: Profile;

  @Prop({
    type: String,
    enum: TaskType,
    required: true,
  })
  taskType: TaskType;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: User.name,
    required: false,
  })
  assignedBy: User;

  @Prop({
    type: [
      {
        type: MongooseSchema.Types.ObjectId,
        ref: User.name,
      },
    ],
    default: [],
    required: true,
  })
  assignedTo: User[];

  @Prop({
    type: String,
    enum: TaskStatus,
  })
  status: TaskStatus;

  @Prop({
    type: [
      {
        type: MongooseSchema.Types.ObjectId,
        ref: Report.name,
      },
    ],
    default: [],
    requied: false,
  })
  @IsOptional()
  reports: Report[];

  @Prop({
    type: Date,
  })
  dueDate: Date;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: Order.name,
    required: true,
  })
  orderId: Order;

  @Prop({
    type: [
      {
        type: MongooseSchema.Types.ObjectId,
        ref: Task.name,
      },
    ],
    default: [],
    required: false,
  })
  @IsOptional()
  subTasks: Task[];
}

export const TaskSchema = SchemaFactory.createForClass(Task);
TaskSchema.plugin(paginate);
TaskSchema.loadClass(Task);

export interface TaskModel extends Model<Task>, PaginateModel<Task> {}
