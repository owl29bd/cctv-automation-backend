import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CurrentUser } from 'src/decorators/user.decorator';
import { CreateMaintenanceRequestDto } from 'src/dtos/requests/maintenance-request.dto';
import { PaginationQueryDto } from 'src/dtos/requests/query.dto';
import { CameraStatus } from 'src/enums/camera-status.enum';
import { MaintenanceRequestStatus } from 'src/enums/maintenance-request-status.enum';
import { Role } from 'src/enums/role.enum';
import { Camera, CameraModel } from 'src/schema/camera.schema';
import {
  MaintenanceRequest,
  MaintenanceRequestModel,
} from 'src/schema/maintenance-request.schema';
import { User, UserModel } from 'src/schema/user.schema';
import { CameraService } from '../camera/camera.service';

@Injectable()
export class MaintenanceRequestService {
  constructor(
    @InjectModel(MaintenanceRequest.name)
    private maintenanceRequestModel: MaintenanceRequestModel,
    @InjectModel(Camera.name)
    private cameraModel: CameraModel,
    @InjectModel(User.name)
    private userModel: UserModel,
    private readonly cameraService: CameraService,
  ) {}

  async hasActiveMaintenanceRequest(cameraId: string): Promise<boolean> {
    const activeRequest = await this.maintenanceRequestModel.findOne({
      camera: cameraId,
      status: {
        $in: [
          MaintenanceRequestStatus.Pending,
          MaintenanceRequestStatus.InProgress,
          MaintenanceRequestStatus.PendingVerification,
        ],
      },
    });

    return !!activeRequest;
  }

  async createMaintenanceRequest(
    createMaintenanceRequestDto: CreateMaintenanceRequestDto,
    CurrentUser: CurrentUser,
  ) {
    const { cameraId, notes, serviceProviderId } = createMaintenanceRequestDto;
    const administratorId = CurrentUser.id;
    // Verify camera exists
    const camera = await this.cameraModel.findById(cameraId);
    if (!camera) {
      throw new NotFoundException('Camera not found');
    }

    // Check if camera already has an active maintenance request
    const hasActiveRequest = await this.hasActiveMaintenanceRequest(cameraId);
    if (hasActiveRequest) {
      throw new HttpException(
        'Camera already has an active maintenance request',
        HttpStatus.BAD_REQUEST,
      );
    }

    const maintenanceRequest = new this.maintenanceRequestModel({
      camera: cameraId,
      status: MaintenanceRequestStatus.InProgress,
      requestDate: new Date(),
      notes,
      administratorId,
      serviceProviderId,
    });

    const res = await maintenanceRequest.save();

    // Update camera status to Maintenance
    await this.cameraModel.findByIdAndUpdate(cameraId, {
      status: CameraStatus.Maintenance,
    });

    return res;
  }

  async getMaintenanceRequests(query: PaginationQueryDto) {
    const maintenanceRequests = await this.maintenanceRequestModel.paginate(
      {
        ...query.filter,
      },
      {
        limit: query.limit,
        page: query.page,
        sort: query.sortBy,
        populate: ['camera', 'serviceProviderId'],
      },
    );

    return maintenanceRequests;
  }

  async getMaintenanceRequestById(id: string) {
    const maintenanceRequest = await this.maintenanceRequestModel
      .findById(id)
      .populate('camera')
      .populate('serviceProviderId');

    if (!maintenanceRequest) {
      throw new NotFoundException('Maintenance request not found');
    }

    if (maintenanceRequest.camera) {
      maintenanceRequest.camera = await this.cameraService.getCameraById(
        maintenanceRequest.camera._id.toString(),
      );
    }

    return maintenanceRequest;
  }

  async getLatestMaintenanceRequestByCameraId(cameraId: string) {
    const maintenanceRequest = await this.maintenanceRequestModel
      .findOne({ camera: cameraId })
      .sort({ requestDate: -1 })
      .populate('camera')
      .populate('serviceProviderId');

    if (!maintenanceRequest) {
      throw new NotFoundException(
        'No maintenance requests found for the specified camera',
      );
    }

    return maintenanceRequest;
  }

  async getMaintenanceRequestsByStatus(
    status: MaintenanceRequestStatus,
    query: PaginationQueryDto,
  ) {
    const maintenanceRequests = await this.maintenanceRequestModel.paginate(
      {
        status,
        ...query.filter,
      },
      {
        limit: query.limit,
        page: query.page,
        sort: query.sortBy,
        populate: ['camera', 'serviceProviderId'],
      },
    );

    return maintenanceRequests;
  }

  async getUnassignedMaintenanceRequests(
    query: PaginationQueryDto,
    status?: MaintenanceRequestStatus,
  ) {
    const filter: any = {
      $or: [
        { serviceProviderId: null },
        { serviceProviderId: { $exists: false } },
      ],
      ...query.filter,
    };

    if (status) {
      filter.status = status;
    }

    const maintenanceRequests = await this.maintenanceRequestModel.paginate(
      filter,
      {
        limit: query.limit,
        page: query.page,
        sort: query.sortBy,
        populate: ['camera', 'serviceProviderId'],
      },
    );

    return maintenanceRequests;
  }

  async getMaintenanceRequestsByStatusAndServiceProvider(
    status: MaintenanceRequestStatus,
    serviceProviderId: string,
    query: PaginationQueryDto,
  ) {
    const maintenanceRequests = await this.maintenanceRequestModel.paginate(
      {
        status,
        serviceProviderId,
        ...query.filter,
      },
      {
        limit: query.limit,
        page: query.page,
        sort: query.sortBy,
        populate: ['camera', 'serviceProviderId'],
      },
    );

    return maintenanceRequests;
  }

  async acceptMaintenanceRequest(requestId: string, serviceProviderId: string) {
    const maintenanceRequest =
      await this.maintenanceRequestModel.findById(requestId);

    if (!maintenanceRequest) {
      throw new NotFoundException('Maintenance request not found');
    }

    if (maintenanceRequest.status !== MaintenanceRequestStatus.Pending) {
      throw new HttpException(
        'Only pending requests can be accepted',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Verify service provider matches
    if (
      maintenanceRequest.serviceProviderId?.toString() !== serviceProviderId &&
      !maintenanceRequest.serviceProviderId
    ) {
      // If no service provider assigned, assign the one accepting
      maintenanceRequest.serviceProviderId = serviceProviderId as any;
    } else if (
      maintenanceRequest.serviceProviderId?.toString() !== serviceProviderId
    ) {
      throw new HttpException(
        'You are not authorized to accept this request',
        HttpStatus.FORBIDDEN,
      );
    }

    maintenanceRequest.status = MaintenanceRequestStatus.InProgress;
    maintenanceRequest.acceptedDate = new Date();

    const camera = await this.cameraModel.findById(maintenanceRequest.camera);
    if (camera) {
      camera.status = CameraStatus.Maintenance;
      await camera.save();
    }

    await maintenanceRequest.save();

    return await this.maintenanceRequestModel
      .findById(requestId)
      .populate('camera')
      .populate('serviceProviderId');
  }

  async markAsComplete(
    requestId: string,
    serviceProviderId: string,
    status: CameraStatus,
    feedback?: string,
  ) {
    const maintenanceRequest =
      await this.maintenanceRequestModel.findById(requestId);

    if (!maintenanceRequest) {
      throw new NotFoundException('Maintenance request not found');
    }

    if (maintenanceRequest.status !== MaintenanceRequestStatus.InProgress) {
      throw new HttpException(
        'Only in-progress requests can apply for verification',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Verify service provider matches
    if (
      maintenanceRequest.serviceProviderId?.toString() !== serviceProviderId
    ) {
      throw new HttpException(
        'You are not authorized to apply for verification for this request',
        HttpStatus.FORBIDDEN,
      );
    }

    maintenanceRequest.status = MaintenanceRequestStatus.Completed;
    maintenanceRequest.acceptedDate = new Date();
    if (feedback) {
      maintenanceRequest.feedback = feedback;
    }

    await maintenanceRequest.save();

    const camera = await this.cameraModel.findById(maintenanceRequest.camera);
    if (camera) {
      camera.status = status as CameraStatus;
      await camera.save();
    }

    return await this.maintenanceRequestModel
      .findById(requestId)
      .populate('camera')
      .populate('serviceProviderId');
  }

  async verifyMaintenanceRequest(requestId: string, administratorId: string) {
    const maintenanceRequest =
      await this.maintenanceRequestModel.findById(requestId);

    if (!maintenanceRequest) {
      throw new NotFoundException('Maintenance request not found');
    }

    if (
      maintenanceRequest.status !== MaintenanceRequestStatus.PendingVerification
    ) {
      throw new HttpException(
        'Only pending verification requests can be verified',
        HttpStatus.BAD_REQUEST,
      );
    }

    maintenanceRequest.status = MaintenanceRequestStatus.Completed;

    const camera = await this.cameraModel.findById(maintenanceRequest.camera);
    if (camera) {
      camera.status = CameraStatus.Online;
      await camera.save();
    }

    await maintenanceRequest.save();

    return await this.maintenanceRequestModel
      .findById(requestId)
      .populate('camera')
      .populate('serviceProviderId');
  }

  async getMaintenanceRequestsByServiceProvider(
    serviceProviderId: string,
    query: PaginationQueryDto,
  ) {
    const maintenanceRequests = await this.maintenanceRequestModel.paginate(
      {
        serviceProviderId,
        ...query.filter,
      },
      {
        limit: query.limit,
        page: query.page,
        sort: query.sortBy,
        populate: ['camera', 'serviceProviderId'],
      },
    );

    return maintenanceRequests;
  }

  async rejectVerification(
    requestId: string,
    administratorId: string,
    rejectionNotes?: string,
  ) {
    const maintenanceRequest =
      await this.maintenanceRequestModel.findById(requestId);

    if (!maintenanceRequest) {
      throw new NotFoundException('Maintenance request not found');
    }

    if (
      maintenanceRequest.status !== MaintenanceRequestStatus.PendingVerification
    ) {
      throw new HttpException(
        'Only pending verification requests can be rejected',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Verify administrator matches
    if (maintenanceRequest.administratorId?.toString() !== administratorId) {
      throw new HttpException(
        'You are not authorized to reject this request',
        HttpStatus.FORBIDDEN,
      );
    }

    maintenanceRequest.status = MaintenanceRequestStatus.InProgress;

    // Add rejection notes to existing notes or replace
    if (rejectionNotes) {
      maintenanceRequest.notes = rejectionNotes;
    }

    await maintenanceRequest.save();

    return await this.maintenanceRequestModel
      .findById(requestId)
      .populate('camera')
      .populate('serviceProviderId');
  }

  async assignServiceProvider(
    requestId: string,
    serviceProviderId: string | null | undefined,
    administratorId: string,
  ) {
    const maintenanceRequest =
      await this.maintenanceRequestModel.findById(requestId);

    if (!maintenanceRequest) {
      throw new NotFoundException('Maintenance request not found');
    }

    // Allow assignment only for Pending and InProgress status requests
    if (
      maintenanceRequest.status !== MaintenanceRequestStatus.Pending &&
      maintenanceRequest.status !== MaintenanceRequestStatus.InProgress
    ) {
      throw new HttpException(
        'Service provider can only be assigned to pending or in-progress requests',
        HttpStatus.BAD_REQUEST,
      );
    }

    // If serviceProviderId is null, empty, or undefined, unassign the service provider
    if (!serviceProviderId || serviceProviderId.trim() === '') {
      maintenanceRequest.serviceProviderId = undefined as any;
      await maintenanceRequest.save();

      return await this.maintenanceRequestModel
        .findById(requestId)
        .populate(['camera', 'serviceProviderId']);
    }

    // Verify the service provider user exists and has ServiceProvider role
    const serviceProvider = await this.userModel.findById(serviceProviderId);
    if (!serviceProvider) {
      throw new NotFoundException('Service provider not found');
    }

    if (serviceProvider.role !== Role.ServiceProvider) {
      throw new HttpException(
        'User is not a service provider',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Assign the service provider (allow reassignment)
    maintenanceRequest.serviceProviderId = serviceProviderId as any;

    await maintenanceRequest.save();

    return await this.maintenanceRequestModel
      .findById(requestId)
      .populate(['camera', 'serviceProviderId']);
  }
}
