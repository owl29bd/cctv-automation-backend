import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RegisterDto } from 'src/dtos/requests/auth.dto';
import { PaginationQueryDto } from 'src/dtos/requests/query.dto';
import { UpdateUserDto } from 'src/dtos/requests/user-management.dto';
import { Role } from 'src/enums/role.enum';
import { UserStatus } from 'src/enums/status.enum';
import { User, UserModel } from 'src/schema/user.schema';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserManagementService {
  constructor(
    private authService: AuthService,
    @InjectModel(User.name) private userModel: UserModel,
  ) {}
  async createUser(createUserDto: RegisterDto) {
    if (await this.userModel.isEmailTaken(createUserDto.email)) {
      throw new HttpException('Email already taken', HttpStatus.CONFLICT);
    }

    const user = await this.authService.register(createUserDto);

    return user;
  }

  async updateUser(userId: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.findByIdAndUpdate(userId, updateUserDto, {
      new: true,
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (updateUserDto.role !== Role.Admin) {
      user.status = Array.from(new Set([...user.status, UserStatus.Active]));

      await user.save();
    }

    return user;
  }

  async getUsers(query: PaginationQueryDto) {
    const users = await this.userModel.paginate(
      {
        ...query.filter,
      },
      {
        limit: query.limit,
        page: query.page,
        sort: query.sortBy,
      },
    );

    return users;
  }

  async deleteUser(userId: string) {
    const user = await this.userModel.findByIdAndDelete(userId);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async getUserById(userId: string) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async getUsersByRole(role: string, query: PaginationQueryDto) {
    const users = await this.userModel.paginate(
      {
        role,
      },
      {
        limit: query.limit,
        page: query.page,
        sort: query.sortBy,
      },
    );

    return users;
  }
}
