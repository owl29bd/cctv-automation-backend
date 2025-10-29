import * as bcrypt from 'bcrypt';
import * as paginate from 'mongoose-paginate-v2';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model, PaginateModel } from 'mongoose';
import { Gender } from 'src/enums/gender.enum';
import { Role } from 'src/enums/role.enum';
import { UserStatus } from 'src/enums/status.enum';

@Schema({ versionKey: false, timestamps: true })
export class User extends Document {
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop({
    type: String,
    enum: Role,
    default: Role.User,
  })
  role: Role;

  @Prop()
  oAuthId?: string;

  @Prop()
  profileImage?: string;

  @Prop()
  phone?: string;

  @Prop({
    type: String,
    enum: Gender,
  })
  gender?: Gender;

  @Prop({
    type: [String],
    enum: UserStatus,
    default: [],
  })
  status: UserStatus[];

  async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.statics.isEmailTaken = async function (
  email: string,
  excludeUserId?: string,
): Promise<boolean> {
  const user = await this.findOne({
    email,
    _id: {
      $ne: excludeUserId,
    },
  });
  return !!user;
};

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
  }
  next();
});

UserSchema.plugin(paginate);

UserSchema.loadClass(User);

export interface UserModel extends Model<User>, PaginateModel<User> {
  isEmailTaken(email: string): Promise<boolean>;
  validatePassword(password: string): Promise<boolean>;
}
