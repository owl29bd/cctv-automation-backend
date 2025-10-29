import { Expose, Transform } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';

export abstract class PaginatedResponse<T> {
  @ApiProperty()
  @Expose()
  limit: number;

  @ApiProperty()
  @Expose()
  hasPrevPage: boolean;

  @ApiProperty()
  @Expose()
  hasNextPage: boolean;

  @ApiProperty()
  @Expose()
  page: number;

  @ApiProperty()
  @Expose()
  totalPages: number;

  @ApiProperty()
  @Expose()
  offset: number;

  @ApiProperty()
  @Expose()
  prevPage: number;

  @ApiProperty()
  @Expose()
  nextPage: number;

  @ApiProperty()
  @Expose()
  pagingCounter: number;

  @ApiProperty()
  @Expose()
  @Transform(({ obj }) => obj['totalDocs'])
  totalData: number;

  @ApiProperty()
  @Expose()
  @Transform(({ obj }) => obj['docs'])
  abstract data: T[];
}
