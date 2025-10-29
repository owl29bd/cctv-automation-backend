import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateProfileDto {
  @ApiProperty({
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    example: 'johndoe@gmail.com',
  })
  email: string;

  @ApiProperty({
    example: '1234567890',
  })
  phone: string;

  @ApiProperty({
    example: '123 Main St.',
  })
  address: string;

  @ApiProperty({
    example: 'This is a test profile',
  })
  details: string;

  @ApiProperty({
    type: [Object],
  })
  remarks: Object[];

  @ApiProperty({
    example: '60c9b9e5b3d5c7b4b0f8b4f0',
  })
  orderId: string;
}

export class UpdateProfileDto extends PartialType(CreateProfileDto) {}
