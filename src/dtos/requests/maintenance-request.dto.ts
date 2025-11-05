import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMaintenanceRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  cameraId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  serviceProviderId: string;
}

export class ApplyVerificationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class RejectVerificationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class AssignServiceProviderDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  serviceProviderId?: string;
}
