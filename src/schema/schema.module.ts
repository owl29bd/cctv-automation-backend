import { Global, Module } from '@nestjs/common';
import { User, UserSchema } from './user.schema';

import { MongooseModule } from '@nestjs/mongoose';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  exports: [MongooseModule],
})
export class SchemaModule {}
