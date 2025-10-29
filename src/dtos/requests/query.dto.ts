import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PaginationQueryOptions {
  @ApiPropertyOptional({ default: 1 })
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional({ default: 10 })
  @Type(() => Number)
  limit?: number;

  @ApiPropertyOptional({
    type: [String],
    description: 'Format: fieldName:asc|desc',
  })
  @Type(() => String)
  sortBy?: string | string[];

  @ApiPropertyOptional({
    type: [String],
    description: 'Format: fieldName:value',
  })
  @Type(() => String)
  filter?: string | string[];

  @ApiPropertyOptional()
  @Type(() => String)
  search?: string;
}

export interface PaginationQueryDto {
  page: number;
  limit: number;
  sortBy?: { [key: string]: -1 | 1 };
  filter?: { [key: string]: string };
  search?: string;
}
