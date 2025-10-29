import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { OrderFile } from 'src/schema/order-schema';
import { BaseResponse } from './base.res';
import { PaginatedResponse } from './paginated.res';

export class OrderManagementResponse extends BaseResponse {
  @ApiProperty()
  @Expose()
  clientName: string;

  @ApiProperty()
  @Expose()
  files: OrderFile[];

  @ApiProperty()
  @Expose()
  remarks: string;

  @ApiProperty()
  @Expose()
  dueDate: Date;
}

export class PaginatedOrderResponse extends PaginatedResponse<OrderManagementResponse> {
  @ApiProperty({ type: [OrderManagementResponse] })
  @Type(() => OrderManagementResponse)
  data: OrderManagementResponse[];
}
