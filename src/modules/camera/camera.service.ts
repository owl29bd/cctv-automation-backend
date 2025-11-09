import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCameraDto, UpdateCameraDto } from 'src/dtos/requests/camera.dto';
import { PaginationQueryDto } from 'src/dtos/requests/query.dto';
import { CameraStatus } from 'src/enums/camera-status.enum';
import { Camera, CameraModel } from 'src/schema/camera.schema';

@Injectable()
export class CameraService {
  constructor(@InjectModel(Camera.name) private cameraModel: CameraModel) {}

  // Helper method to convert Buffer to base64
  convertImageToBase64(camera: any): any {
    if (!camera) return camera;

    // Don't convert to object yet, keep the document to preserve Buffer
    const hasImage = camera.image;

    if (hasImage) {
      let imageBuffer: Buffer;

      // Handle both Buffer and plain object representation
      if (Buffer.isBuffer(camera.image)) {
        imageBuffer = camera.image;
      } else if (
        camera.image?.type === 'Buffer' &&
        Array.isArray(camera.image?.data)
      ) {
        // Convert plain object representation back to Buffer
        imageBuffer = Buffer.from(camera.image.data);
      } else if (camera.image?.buffer) {
        // Handle Mongoose internal buffer representation
        imageBuffer = Buffer.from(camera.image.buffer);
      } else {
        // Image is not in a recognized format, return as is
        return camera.toObject ? camera.toObject() : camera;
      }

      const base64Image = imageBuffer.toString('base64');
      const imageDataUri = `data:${camera.imageContentType || 'image/jpeg'};base64,${base64Image}`;

      // Now convert to object and update the image field
      const cameraObj = camera.toObject ? camera.toObject() : { ...camera };
      cameraObj.image = imageDataUri;
      return cameraObj;
    }

    return camera.toObject ? camera.toObject() : { ...camera };
  }

  // Helper method to convert images in paginated results
  private convertPaginatedImages(result: any): any {
    if (!result) return result;

    // Handle mongoose-paginate-v2 response
    if (result.docs && Array.isArray(result.docs)) {
      result.docs = result.docs.map((camera: any) =>
        this.convertImageToBase64(camera),
      );
    }

    return result;
  }

  async createCamera(
    createCameraDto: CreateCameraDto,
    image?: Express.Multer.File,
  ) {
    const cameraData: any = {
      name: createCameraDto.name,
      description: createCameraDto.description,
      location: createCameraDto.location,
      ip: createCameraDto.ip,
      serialNumber: createCameraDto.serialNumber,
      status: createCameraDto.status || CameraStatus.Online,
    };

    // If an image is uploaded, store it as binary
    if (image) {
      cameraData.image = image.buffer;
      cameraData.imageContentType = image.mimetype;
    }

    const camera = new this.cameraModel(cameraData);

    const savedCamera = await camera.save();
    return this.convertImageToBase64(savedCamera.toObject());
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

    return this.convertPaginatedImages(cameras);
  }

  async getCameraById(id: string) {
    const camera = await this.cameraModel.findById(id);

    if (!camera) {
      throw new NotFoundException('Camera not found');
    }

    return this.convertImageToBase64(camera.toObject());
  }

  async updateCamera(
    id: string,
    updateCameraDto: UpdateCameraDto,
    image?: Express.Multer.File,
  ) {
    const updateData: any = { ...updateCameraDto };

    // If a new image is uploaded, update it
    if (image) {
      updateData.image = image.buffer;
      updateData.imageContentType = image.mimetype;
    }

    const camera = await this.cameraModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!camera) {
      throw new NotFoundException('Camera not found');
    }

    return this.convertImageToBase64(camera.toObject());
  }

  async deleteCamera(id: string) {
    const camera = await this.cameraModel.findByIdAndDelete(id);

    if (!camera) {
      throw new NotFoundException('Camera not found');
    }

    return this.convertImageToBase64(camera.toObject());
  }

  async getCamerasByStatus(status: CameraStatus, query: PaginationQueryDto) {
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

    return this.convertPaginatedImages(cameras);
  }

  async getAllCameraIdsAndIps() {
    const cameras = await this.cameraModel
      .find({ status: { $ne: CameraStatus.Maintenance } }, { _id: 1, ip: 1 })
      .lean();
    return cameras.map((camera) => ({
      id: camera._id.toString(),
      ip: camera.ip,
    }));
  }
}
