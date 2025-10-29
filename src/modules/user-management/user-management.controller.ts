import {
  Body,
  Catch,
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
  CreateUserDto,
  UpdateUserDto,
} from 'src/dtos/requests/user-management.dto';
import {
  PaginatedUserResponse,
  UserResponse,
} from 'src/dtos/responses/user.res';
import { Role } from 'src/enums/role.enum';
import { QueryTransformPipe } from 'src/pipes/query.pipe';
import { ObjectIdValidationPipe } from 'src/pipes/validation.pipe';
import { UserManagementService } from './user-management.service';

@Catch()
@ApiTags('User-Management')
@Controller('user-management')
export class UserManagementController {
  constructor(private userManagementService: UserManagementService) {}

  @ApiResponse({ type: UserResponse })
  @AllowedRoles(Role.Admin)
  @Post('create')
  async registerAdmin(
    @GetUser() user: CurrentUser,
    @Body() createUserDto: CreateUserDto,
  ) {
    const result = await this.userManagementService.createUser(createUserDto);

    return plainToInstance(UserResponse, result, {
      enableCircularCheck: true,
    });
  }

  @ApiResponse({ type: UserResponse })
  @AllowedRoles(Role.Admin)
  @Patch('update/:userId')
  async updateUser(
    @Param('userId', ObjectIdValidationPipe) userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const result = await this.userManagementService.updateUser(
      userId,
      updateUserDto,
    );

    return plainToInstance(UserResponse, result, {
      enableCircularCheck: true,
    });
  }

  @ApiResponse({ type: PaginatedUserResponse })
  @ApiQuery({ type: PaginationQueryOptions })
  @Get()
  async getUsers(@Query(QueryTransformPipe) query: PaginationQueryDto) {
    const result = await this.userManagementService.getUsers(query);

    return plainToInstance(PaginatedUserResponse, result, {
      enableCircularCheck: true,
    });
  }

  @ApiResponse({ type: UserResponse })
  @AllowedRoles(Role.Admin)
  @Get('/:userId')
  async getUser(@Param('userId', ObjectIdValidationPipe) userId: string) {
    const result = await this.userManagementService.getUserById(userId);

    return plainToInstance(UserResponse, result, {
      enableCircularCheck: true,
    });
  }

  @ApiResponse({ type: UserResponse })
  @AllowedRoles(Role.Admin)
  @Delete('/:userId')
  async deleteUser(@Param('userId', ObjectIdValidationPipe) userId: string) {
    const result = await this.userManagementService.deleteUser(userId);

    return plainToInstance(UserResponse, result, {
      enableCircularCheck: true,
    });
  }

  @ApiResponse({ type: PaginatedUserResponse })
  @ApiQuery({ type: PaginationQueryOptions })
  @Get('getUsersByRole/:role')
  async getUsersByRole(
    @Param('role') role: string,
    @Query(QueryTransformPipe) query: PaginationQueryDto,
  ) {
    const result = await this.userManagementService.getUsersByRole(role, query);

    return plainToInstance(PaginatedUserResponse, result, {
      enableCircularCheck: true,
    });
  }
}
