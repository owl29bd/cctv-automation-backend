import { Expose, Transform } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';

export class BaseResponse {
  @ApiProperty()
  @Expose()
  @Transform(({ key, obj }) => obj._id?.toString() || obj.id)
  id: string;

  @ApiProperty({ type: Date })
  @Expose()
  createdAt: Date;

  @ApiProperty({ type: Date })
  @Expose()
  updatedAt: Date;
}
