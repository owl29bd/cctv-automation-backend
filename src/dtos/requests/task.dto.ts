import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsDefined, IsMongoId, IsOptional, ValidateIf } from 'class-validator';
import { TaskStatus } from 'src/enums/task-status.enum';
import { TaskType } from 'src/enums/task-type.enum';

export class CreateTaskDto {
  @ApiProperty()
  @ValidateIf((o) => !o.profileId)
  @IsDefined({ message: 'Profile Id is required' })
  @IsMongoId({ message: 'Invalid profile ID' })
  profileId: string;

  @ApiProperty({
    example: TaskType.SENIOR_ANALYST_TO_ANALYST,
  })
  @IsDefined({ message: 'Task Type is required' })
  taskType: string;

  @ApiProperty()
  @ValidateIf((o) => !o.assignedBy)
  @IsDefined({ message: 'Assigned By is required' })
  @IsMongoId({ message: 'Invaid assigned by' })
  assignedBy: string;

  @ApiProperty()
  @ValidateIf((o) => !o.assignedTo)
  @IsDefined({ message: 'Assigned To is required' })
  @IsMongoId({ message: 'invalid assigned to' })
  assignedTo: string[];

  @ApiProperty({
    example: TaskStatus.TODO,
  })
  status: string;

  @ApiProperty({
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsMongoId({ each: true, message: 'Invalid Report ID' })
  reports: string[];

  @ApiProperty({
    example: '2021-09-30T00:00:00.000Z',
  })
  dueDate: Date;

  @ApiProperty()
  @ValidateIf((o) => !o.orderId)
  @IsDefined({ message: 'Order Id is required' })
  @IsMongoId({ message: 'invalid order id' })
  orderId: string;

  @ApiProperty({
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsMongoId({ each: true, message: 'Invalid Sub Task ID' })
  subTasks: string[];
}

export class CreateSubTaskSiDto {
  @ApiProperty()
  @IsDefined({ message: 'Assigned To is required' })
  @IsMongoId({ message: 'Invalid assigned to' })
  assignedTo: string;

  @ApiProperty({
    example: '2021-09-30T00:00:00.000Z',
  })
  dueDate: Date;
}

export class CreateSubTaskDto {
  @ApiProperty()
  @ValidateIf((o) => !o.assignedTo)
  @IsDefined({ message: 'Assigned To is required' })
  @IsMongoId({ message: 'invalid assigned to' })
  assignedTo: string[];

  @ApiProperty({
    example: '2021-09-30T00:00:00.000Z',
  })
  dueDate: Date;
}

export class CreateBulkTaskDto {
  @ApiProperty()
  @ValidateIf((o) => !o.orderId)
  @IsDefined({ message: 'order Id is required' })
  @IsMongoId({ message: 'Invalid order ID' })
  orderId: string;
}

export class UpdateTaskDto extends PartialType(CreateTaskDto) {}
