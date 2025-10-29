import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from './base.res';
import { Expose, Type } from 'class-transformer';
import { TaskType } from 'src/enums/task-type.enum';
import { UserResponse } from './user.res';
import { ProfileResponse } from './profile.res';
import { ReportResponse } from './report.res';
import { PaginatedResponse } from './paginated.res';
import { OrderManagementResponse } from './order-management.res';
import { TaskStatus } from 'src/enums/task-status.enum';

export class TaskResponse extends BaseResponse {
  @ApiProperty()
  @Expose()
  @Type(() => ProfileResponse)
  profileId: ProfileResponse;

  @ApiProperty({ enum: TaskType })
  @Expose()
  taskType: TaskType;

  @ApiProperty()
  @Expose()
  @Type(() => UserResponse)
  assignedBy: UserResponse;

  @ApiProperty({ type: [UserResponse] })
  @Expose()
  @Type(() => UserResponse)
  assignedTo: UserResponse[];

  @ApiProperty()
  @Expose()
  status: TaskStatus;

  @ApiProperty({ type: [ReportResponse] })
  @Expose()
  @Type(() => ReportResponse)
  reports: ReportResponse[];

  @ApiProperty()
  @Expose()
  dueDate: Date;

  @ApiProperty()
  @Expose()
  @Type(() => OrderManagementResponse)
  orderId: OrderManagementResponse;

  @ApiProperty({ type: [TaskResponse], required: false })
  @Expose()
  @Type(() => TaskResponse)
  subTasks: TaskResponse[];
}

export class PaginatedTaskResponse extends PaginatedResponse<TaskResponse> {
  @ApiProperty({ type: [TaskResponse] })
  @Type(() => TaskResponse)
  data: TaskResponse[];
}
