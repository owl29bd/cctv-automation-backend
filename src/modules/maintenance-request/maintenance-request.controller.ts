import {
  Body,
  Controller,
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
  ApplyVerificationDto,
  AssignServiceProviderDto,
  CreateMaintenanceRequestDto,
  RejectVerificationDto,
} from 'src/dtos/requests/maintenance-request.dto';
import {
  PaginationQueryDto,
  PaginationQueryOptions,
} from 'src/dtos/requests/query.dto';
import {
  MaintenanceRequestResponse,
  PaginatedMaintenanceRequestResponse,
} from 'src/dtos/responses/maintenance-request.res';
import { MaintenanceRequestStatus } from 'src/enums/maintenance-request-status.enum';
import { Role } from 'src/enums/role.enum';
import { QueryTransformPipe } from 'src/pipes/query.pipe';
import { ObjectIdValidationPipe } from 'src/pipes/validation.pipe';
import { MaintenanceRequestService } from './maintenance-request.service';

@ApiTags('Maintenance-Request')
@Controller('maintenance-request')
export class MaintenanceRequestController {
  constructor(private maintenanceRequestService: MaintenanceRequestService) {}

  @ApiResponse({ type: MaintenanceRequestResponse })
  @AllowedRoles(Role.Administrator, Role.Admin)
  @Post()
  async createMaintenanceRequest(
    @GetUser() user: CurrentUser,
    @Body() createMaintenanceRequestDto: CreateMaintenanceRequestDto,
  ) {
    const result =
      await this.maintenanceRequestService.createMaintenanceRequest(
        createMaintenanceRequestDto.cameraId,
        user.id,
        createMaintenanceRequestDto.notes,
      );

    return plainToInstance(MaintenanceRequestResponse, result, {
      enableCircularCheck: true,
    });
  }

  @ApiResponse({ type: PaginatedMaintenanceRequestResponse })
  @ApiQuery({ type: PaginationQueryOptions })
  @Get()
  async getMaintenanceRequests(
    @Query(QueryTransformPipe) query: PaginationQueryDto,
  ) {
    const result =
      await this.maintenanceRequestService.getMaintenanceRequests(query);

    return plainToInstance(PaginatedMaintenanceRequestResponse, result, {
      enableCircularCheck: true,
    });
  }

  @ApiResponse({ type: MaintenanceRequestResponse })
  @Get('/:requestId')
  async getMaintenanceRequestById(
    @Param('requestId', ObjectIdValidationPipe) requestId: string,
  ) {
    const result =
      await this.maintenanceRequestService.getMaintenanceRequestById(requestId);

    return plainToInstance(MaintenanceRequestResponse, result, {
      enableCircularCheck: true,
    });
  }

  @ApiResponse({ type: MaintenanceRequestResponse })
  @Get('latest/:cameraId')
  async getLatestMaintenanceRequestByCameraId(
    @Param('cameraId', ObjectIdValidationPipe) cameraId: string,
  ) {
    const result =
      await this.maintenanceRequestService.getLatestMaintenanceRequestByCameraId(
        cameraId,
      );

    return plainToInstance(MaintenanceRequestResponse, result, {
      enableCircularCheck: true,
    });
  }

  @ApiResponse({ type: PaginatedMaintenanceRequestResponse })
  @ApiQuery({ type: PaginationQueryOptions })
  @Get('status/:status')
  async getMaintenanceRequestsByStatus(
    @Param('status') status: MaintenanceRequestStatus,
    @Query(QueryTransformPipe) query: PaginationQueryDto,
  ) {
    const result =
      await this.maintenanceRequestService.getMaintenanceRequestsByStatus(
        status,
        query,
      );

    return plainToInstance(PaginatedMaintenanceRequestResponse, result, {
      enableCircularCheck: true,
    });
  }

  @ApiResponse({ type: MaintenanceRequestResponse })
  @AllowedRoles(Role.ServiceProvider, Role.Admin, Role.Administrator)
  @Patch('/:requestId/accept')
  async acceptMaintenanceRequest(
    @Param('requestId', ObjectIdValidationPipe) requestId: string,
    @GetUser() user: CurrentUser,
  ) {
    const result =
      await this.maintenanceRequestService.acceptMaintenanceRequest(
        requestId,
        user.id,
      );

    return plainToInstance(MaintenanceRequestResponse, result, {
      enableCircularCheck: true,
    });
  }

  @ApiResponse({ type: MaintenanceRequestResponse })
  @AllowedRoles(Role.ServiceProvider, Role.Admin, Role.Administrator)
  @Patch('/:requestId/apply-verification')
  async applyForVerification(
    @Param('requestId', ObjectIdValidationPipe) requestId: string,
    @GetUser() user: CurrentUser,
    @Body() applyVerificationDto: ApplyVerificationDto,
  ) {
    const result = await this.maintenanceRequestService.applyForVerification(
      requestId,
      user.id,
      applyVerificationDto.notes,
    );

    return plainToInstance(MaintenanceRequestResponse, result, {
      enableCircularCheck: true,
    });
  }

  @ApiResponse({ type: MaintenanceRequestResponse })
  @AllowedRoles(Role.Administrator, Role.Admin)
  @Patch('/:requestId/verify')
  async verifyMaintenanceRequest(
    @Param('requestId', ObjectIdValidationPipe) requestId: string,
    @GetUser() user: CurrentUser,
  ) {
    const result =
      await this.maintenanceRequestService.verifyMaintenanceRequest(
        requestId,
        user.id,
      );

    return plainToInstance(MaintenanceRequestResponse, result, {
      enableCircularCheck: true,
    });
  }

  @ApiResponse({ type: MaintenanceRequestResponse })
  @AllowedRoles(Role.Administrator, Role.Admin)
  @Patch('/:requestId/reject')
  async rejectVerification(
    @Param('requestId', ObjectIdValidationPipe) requestId: string,
    @GetUser() user: CurrentUser,
    @Body() rejectVerificationDto: RejectVerificationDto,
  ) {
    const result = await this.maintenanceRequestService.rejectVerification(
      requestId,
      user.id,
      rejectVerificationDto.notes,
    );

    return plainToInstance(MaintenanceRequestResponse, result, {
      enableCircularCheck: true,
    });
  }

  @ApiResponse({ type: PaginatedMaintenanceRequestResponse })
  @ApiQuery({ type: PaginationQueryOptions })
  @AllowedRoles(Role.ServiceProvider, Role.Admin, Role.Administrator)
  @Get('service-provider/my-requests')
  async getMyMaintenanceRequests(
    @GetUser() user: CurrentUser,
    @Query(QueryTransformPipe) query: PaginationQueryDto,
  ) {
    const result =
      await this.maintenanceRequestService.getMaintenanceRequestsByServiceProvider(
        user.id,
        query,
      );

    return plainToInstance(PaginatedMaintenanceRequestResponse, result, {
      enableCircularCheck: true,
    });
  }

  @ApiResponse({ type: MaintenanceRequestResponse })
  @AllowedRoles(Role.Administrator, Role.Admin)
  @Patch('/:requestId/assign-service-provider')
  async assignServiceProvider(
    @Param('requestId', ObjectIdValidationPipe) requestId: string,
    @GetUser() user: CurrentUser,
    @Body() assignServiceProviderDto: AssignServiceProviderDto,
  ) {
    const result = await this.maintenanceRequestService.assignServiceProvider(
      requestId,
      assignServiceProviderDto.serviceProviderId,
      user.id,
    );

    return plainToInstance(MaintenanceRequestResponse, result, {
      enableCircularCheck: true,
    });
  }

  @ApiResponse({ type: PaginatedMaintenanceRequestResponse })
  @ApiQuery({ type: PaginationQueryOptions })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: MaintenanceRequestStatus,
  })
  @AllowedRoles(Role.ServiceProvider, Role.Admin, Role.Administrator)
  @Get('unassigned')
  async getUnassignedMaintenanceRequests(
    @Query(QueryTransformPipe) query: PaginationQueryDto,
    @Query('status') status?: MaintenanceRequestStatus,
  ) {
    const result =
      await this.maintenanceRequestService.getUnassignedMaintenanceRequests(
        query,
        status,
      );

    return plainToInstance(PaginatedMaintenanceRequestResponse, result, {
      enableCircularCheck: true,
    });
  }

  @ApiResponse({ type: PaginatedMaintenanceRequestResponse })
  @ApiQuery({ type: PaginationQueryOptions })
  @AllowedRoles(Role.ServiceProvider, Role.Admin, Role.Administrator)
  @Get('status/:status/service-provider/my-requests')
  async getMyMaintenanceRequestsByStatus(
    @Param('status') status: MaintenanceRequestStatus,
    @GetUser() user: CurrentUser,
    @Query(QueryTransformPipe) query: PaginationQueryDto,
  ) {
    const result =
      await this.maintenanceRequestService.getMaintenanceRequestsByStatusAndServiceProvider(
        status,
        user.id,
        query,
      );

    return plainToInstance(PaginatedMaintenanceRequestResponse, result, {
      enableCircularCheck: true,
    });
  }
}
