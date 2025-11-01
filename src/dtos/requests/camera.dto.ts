import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { CameraStatus } from 'src/enums/camera-status.enum';

export class CreateCameraDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  location: string;

  @ApiPropertyOptional({ enum: CameraStatus, default: CameraStatus.Online })
  @IsOptional()
  @IsEnum(CameraStatus)
  status?: CameraStatus;
}

export class UpdateCameraDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ enum: CameraStatus })
  @IsOptional()
  @IsEnum(CameraStatus)
  status?: CameraStatus;
}

