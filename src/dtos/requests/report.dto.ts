import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsDefined, IsOptional } from 'class-validator';
import { ReportLevel } from 'src/enums/report-level.enum';
import { ReportStatus } from 'src/enums/report-status.enum';

export class CreateReportDto {
  @ApiProperty({
    example: '',
  })
  orderId: string;

  @ApiProperty({
    example: '',
  })
  @IsDefined({ message: 'Profile Id is required' })
  profileId: string;

  @ApiProperty({})
  submittedBy: string;

  @ApiProperty({
    example: ReportLevel.RL1,
  })
  reportLevel: ReportLevel;

  @ApiProperty({
    type: [Object],
  })
  details: Object[];

  @ApiProperty({
    example: ReportStatus.TO_DO,
  })
  status: ReportStatus;

  @ApiProperty()
  @IsOptional()
  feedback: string;
}

export class UpdateReportDto extends PartialType(CreateReportDto) {}
