import { Global, Module } from '@nestjs/common';
import { StoredFile, StoredFileSchema } from './stored-file.schema';
import { User, UserSchema } from './user.schema';

import { MongooseModule } from '@nestjs/mongoose';
import { Feedback, FeedbackSchema } from './feedback.schema';
import { Order, OrderSchema } from './order-schema';
import { Profile, ProfileSchema } from './profile.schema';
import { Report, ReportSchema } from './report.schema';
import { Task, TaskSchema } from './task.schema';
import { UserGroup, UserGroupSchema } from './user-group.schema';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: StoredFile.name,
        schema: StoredFileSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: UserGroup.name,
        schema: UserGroupSchema,
      },
      {
        name: Order.name,
        schema: OrderSchema,
      },
      {
        name: Profile.name,
        schema: ProfileSchema,
      },
      {
        name: Report.name,
        schema: ReportSchema,
      },
      {
        name: Task.name,
        schema: TaskSchema,
      },
      {
        name: Feedback.name,
        schema: FeedbackSchema
      }
    ]),
  ],
  exports: [MongooseModule],
})
export class SchemaModule {}
