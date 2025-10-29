import * as paginate from 'mongoose-paginate-v2';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';

import { PaginateModel } from 'mongoose';

@Schema({ versionKey: false, timestamps: true })
export class StoredFile extends Document {
  @Prop()
  key: string;

  @Prop()
  url: string;

  @Prop()
  mimetype: string;

  @Prop()
  size: number;

  @Prop()
  isPublic: boolean;
}

export const StoredFileSchema = SchemaFactory.createForClass(StoredFile);

StoredFileSchema.plugin(paginate);

StoredFileSchema.loadClass(StoredFile);

export interface StoredFileModel
  extends Model<StoredFile>,
    PaginateModel<StoredFile> {}
