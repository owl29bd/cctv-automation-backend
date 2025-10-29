import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { GroupType } from 'src/enums/group-type.enum';
import {
  Document,
  Model,
  Schema as MongooseSchema,
  PaginateModel,
} from 'mongoose';
import { User } from './user.schema';
import * as paginate from 'mongoose-paginate-v2';

@Schema({ versionKey: false, timestamps: true })
export class UserGroup extends Document {
  @Prop({
    required: true,
  })
  groupName: string;

  @Prop({
    type: String,
    enum: GroupType,
    required: true,
  })
  groupType: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  groupLeader: User;

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
  groupMembers: User[];
}

export const UserGroupSchema = SchemaFactory.createForClass(UserGroup);

UserGroupSchema.plugin(paginate);

UserGroupSchema.loadClass(UserGroup);

export interface UserGroupModel
  extends Model<UserGroup>,
    PaginateModel<UserGroup> {}
