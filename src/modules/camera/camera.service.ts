import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationQueryDto } from 'src/dtos/requests/query.dto';
import { CreateCameraDto, UpdateCameraDto } from 'src/dtos/requests/camera.dto';
import { CameraStatus } from 'src/enums/camera-status.enum';
import { Camera, CameraModel } from 'src/schema/camera.schema';

@Injectable()
export class CameraService {
  constructor(
    @InjectModel(Camera.name) private cameraModel: CameraModel,
  ) {}

  async createCamera(createCameraDto: CreateCameraDto) {
    const camera = new this.cameraModel({
      name: createCameraDto.name,
      description: createCameraDto.description,
      location: createCameraDto.location,
      status: createCameraDto.status || CameraStatus.Online,
    });

    return await camera.save();
  }

  async getCameras(query: PaginationQueryDto) {
    const cameras = await this.cameraModel.paginate(
      {
        ...query.filter,
      },
      {
        limit: query.limit,
        page: query.page,
        sort: query.sortBy,
      },
    );

    return cameras;
  }

  async getCameraById(id: string) {
    const camera = await this.cameraModel.findById(id);

    if (!camera) {
      throw new NotFoundException('Camera not found');
    }

    return camera;
  }

  async updateCamera(id: string, updateCameraDto: UpdateCameraDto) {
    const camera = await this.cameraModel.findByIdAndUpdate(
      id,
      updateCameraDto,
      {
        new: true,
      },
    );

    if (!camera) {
      throw new NotFoundException('Camera not found');
    }

    return camera;
  }

  async deleteCamera(id: string) {
    const camera = await this.cameraModel.findByIdAndDelete(id);

    if (!camera) {
      throw new NotFoundException('Camera not found');
    }

    return camera;
  }

  async getCamerasByStatus(
    status: CameraStatus,
    query: PaginationQueryDto,
  ) {
    const cameras = await this.cameraModel.paginate(
      {
        status,
        ...query.filter,
      },
      {
        limit: query.limit,
        page: query.page,
        sort: query.sortBy,
      },
    );

    return cameras;
  }
}

