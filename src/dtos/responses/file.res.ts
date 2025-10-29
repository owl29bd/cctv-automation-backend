import { Expose, Transform, Type } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from './base.res';

export class FileUploadResponse extends BaseResponse {
  @ApiProperty()
  @Expose()
  encoding: string;

  @ApiProperty()
  @Expose()
  mimetype: string;

  @ApiProperty()
  @Expose()
  filename: string;

  @ApiProperty()
  @Expose()
  path: string;

  @ApiProperty()
  @Expose()
  @Type(() => Number)
  size: number;
}

export class FileRes {
  @ApiProperty()
  @Expose()
  @Transform(({ obj }) => obj._id?.toString() || obj.id)
  id: string;

  @ApiProperty()
  @Expose()
  key: string;

  @ApiProperty()
  @Expose()
  url: string;

  @ApiProperty()
  @Expose()
  mimetype: string;

  @ApiProperty()
  @Expose()
  @Type(() => Number)
  size: number;

  @ApiProperty()
  @Expose()
  isPublic: boolean;
}
