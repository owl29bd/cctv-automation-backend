import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { Response } from 'express';
import { AllowedRoles } from 'src/decorators/roles.decorator';
import { CurrentUser, GetUser } from 'src/decorators/user.decorator';
import { CreateCameraDto, UpdateCameraDto } from 'src/dtos/requests/camera.dto';
import {
  PaginationQueryDto,
  PaginationQueryOptions,
} from 'src/dtos/requests/query.dto';
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
  @ApiConsumes('multipart/form-data')
  @AllowedRoles(Role.Administrator, Role.Admin)
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return callback(
            new BadRequestException(
              'Only image files (jpg, jpeg, png, gif, webp) are allowed!',
            ),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async createCamera(
    @GetUser() user: CurrentUser,
    @Body() createCameraDto: CreateCameraDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const result = await this.cameraService.createCamera(
      createCameraDto,
      image,
    );

    return plainToInstance(CameraResponse, result, {
      enableCircularCheck: true,
      excludeExtraneousValues: false,
    });
  }

  @ApiResponse({ type: PaginatedCameraResponse })
  @ApiQuery({ type: PaginationQueryOptions })
  @Get()
  async getCameras(@Query(QueryTransformPipe) query: PaginationQueryDto) {
    const result = await this.cameraService.getCameras(query);
    // Return result directly to preserve base64 image
    return plainToInstance(PaginatedCameraResponse, result, {
      enableCircularCheck: true,
      excludeExtraneousValues: false,
    });
  }

  @ApiResponse({ type: CameraResponse })
  @Get('/:id')
  async getCameraById(@Param('id', ObjectIdValidationPipe) id: string) {
    const result = await this.cameraService.getCameraById(id);
    // Return result directly to preserve base64 image
    return result;
  }

  @ApiResponse({ type: CameraResponse })
  @ApiConsumes('multipart/form-data')
  @AllowedRoles(Role.Administrator, Role.Admin)
  @Patch('/:id')
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return callback(
            new BadRequestException(
              'Only image files (jpg, jpeg, png, gif, webp) are allowed!',
            ),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async updateCamera(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Body() updateCameraDto: UpdateCameraDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const result = await this.cameraService.updateCamera(
      id,
      updateCameraDto,
      image,
    );

    return plainToInstance(CameraResponse, result, {
      enableCircularCheck: true,
      excludeExtraneousValues: false,
    });
  }

  @ApiResponse({ type: CameraResponse })
  @AllowedRoles(Role.Administrator, Role.Admin)
  @Delete('/:id')
  async deleteCamera(@Param('id', ObjectIdValidationPipe) id: string) {
    const result = await this.cameraService.deleteCamera(id);

    return plainToInstance(CameraResponse, result, {
      enableCircularCheck: true,
      excludeExtraneousValues: false,
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
      excludeExtraneousValues: false,
    });
  }

  @Get('/:id/image')
  async getCameraImage(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Res() res: Response,
  ) {
    const camera = await this.cameraService.getCameraById(id);

    if (!camera.image || !camera.imageContentType) {
      throw new NotFoundException('Image not found for this camera');
    }

    res.set('Content-Type', camera.imageContentType);
    res.send(camera.image);
  }
}
