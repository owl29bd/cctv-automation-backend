import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { StoredFile } from 'src/schema/stored-file.schema';

export class CreateOrderDto {
  @ApiProperty({
    example: 'client1',
  })
  @IsNotEmpty()
  clientName: string;

  @ApiProperty({
    example: [],
    default: [],
  })
  @IsOptional()
  files?: StoredFile[];

  @ApiProperty({
    example: 'remarks',
  })
  remarks: string;

  @ApiProperty({
    example: '2022-01-01',
  })
  @IsOptional()
  dueDate?: Date;
}

export class UpdateOrderDto extends PartialType(CreateOrderDto) {}

export class OrderFileUploadDto {
  @ApiProperty({
    example: ['file1', 'file2'],
  })
  base64: string;

  @ApiProperty({
    example: 'file-name',
  })
  name: string;

  @ApiProperty({
    example: 'file-type',
  })
  type: string;
}
