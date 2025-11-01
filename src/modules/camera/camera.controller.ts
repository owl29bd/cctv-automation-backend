import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { AllowedRoles } from 'src/decorators/roles.decorator';
import { CurrentUser, GetUser } from 'src/decorators/user.decorator';
import {
  PaginationQueryDto,
  PaginationQueryOptions,
} from 'src/dtos/requests/query.dto';
import {
  CreateCameraDto,
  UpdateCameraDto,
} from 'src/dtos/requests/camera.dto';
import {
  CameraResponse,
  PaginatedCameraResponse,
} from 'src/dtos/responses/camera.res';
import { CameraStatus } from 'src/enums/camera-status.enum';
import { Role } from 'src/enums/role.enum';
import { QueryTransformPipe } from 'src/pipes/query.pipe';
import { ObjectIdValidationPipe } from 'src/pipes/validation.pipe';
import { CameraService } from './camera.service';

@ApiTags('Camera')
@Controller('camera')
export class CameraController {
  constructor(private cameraService: CameraService) {}

  @ApiResponse({ type: CameraResponse })
  @AllowedRoles(Role.Administrator, Role.Admin)
  @Post()
  async createCamera(
    @GetUser() user: CurrentUser,
    @Body() createCameraDto: CreateCameraDto,
  ) {
    const result = await this.cameraService.createCamera(createCameraDto);

    return plainToInstance(CameraResponse, result, {
      enableCircularCheck: true,
    });
  }

  @ApiResponse({ type: PaginatedCameraResponse })
  @ApiQuery({ type: PaginationQueryOptions })
  @Get()
  async getCameras(@Query(QueryTransformPipe) query: PaginationQueryDto) {
    const result = await this.cameraService.getCameras(query);

    return plainToInstance(PaginatedCameraResponse, result, {
      enableCircularCheck: true,
    });
  }

  @ApiResponse({ type: CameraResponse })
  @Get('/:id')
  async getCameraById(
    @Param('id', ObjectIdValidationPipe) id: string,
  ) {
    const result = await this.cameraService.getCameraById(id);

    return plainToInstance(CameraResponse, result, {
      enableCircularCheck: true,
    });
  }

  @ApiResponse({ type: CameraResponse })
  @AllowedRoles(Role.Administrator, Role.Admin)
  @Patch('/:id')
  async updateCamera(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Body() updateCameraDto: UpdateCameraDto,
  ) {
    const result = await this.cameraService.updateCamera(id, updateCameraDto);

    return plainToInstance(CameraResponse, result, {
      enableCircularCheck: true,
    });
  }

  @ApiResponse({ type: CameraResponse })
  @AllowedRoles(Role.Administrator, Role.Admin)
  @Delete('/:id')
  async deleteCamera(
    @Param('id', ObjectIdValidationPipe) id: string,
  ) {
    const result = await this.cameraService.deleteCamera(id);

    return plainToInstance(CameraResponse, result, {
      enableCircularCheck: true,
    });
  }

  @ApiResponse({ type: PaginatedCameraResponse })
  @ApiQuery({ type: PaginationQueryOptions })
  @Get('status/:status')
  async getCamerasByStatus(
    @Param('status') status: CameraStatus,
    @Query(QueryTransformPipe) query: PaginationQueryDto,
  ) {
    const result = await this.cameraService.getCamerasByStatus(status, query);

    return plainToInstance(PaginatedCameraResponse, result, {
      enableCircularCheck: true,
    });
  }
}

