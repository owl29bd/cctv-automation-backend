import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateFeedbackDto {
  @ApiProperty({
    example: 'client1',
  })
  @IsNotEmpty()
  clientName: string;

  @ApiProperty({
    example: 'abc@gmail.com',
  })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'type 1',
  })
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    example: 'details',
  })
  @IsNotEmpty()
  details: string;
}

export class UpdateFeedbackDto extends PartialType(CreateFeedbackDto) {}
