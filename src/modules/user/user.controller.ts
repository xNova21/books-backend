import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import {
  CreateUserDto,
  LoginUserDto,
  UpdateUserEmailDto,
  DeleteUserDto,
} from './dto/user.dto';
import { UserService } from '@/modules/user/user.service';
import { AuthGuard } from '@/midleware/auth.guard';
import { Request as ExpressRequest } from 'express';

interface AuthenticatedRequest extends ExpressRequest {
  userId?: string;
}
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() body: CreateUserDto) {
    const { username, email, password } = body;
    return await this.userService.createUser(username, email, password);
  }

  @Post('login')
  async loginUser(@Body() body: LoginUserDto) {
    const { email, password } = body;
    return await this.userService.loginUser(email, password);
  }

  @UseGuards(AuthGuard)
  @Post('profile')
  async getUserProfile(@Req() req: AuthenticatedRequest) {
    return await this.userService.getUserProfile(req.userId);
  }

  @UseGuards(AuthGuard)
  @Post('update')
  async updateUser(
    @Body() body: UpdateUserEmailDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const { newEmail } = body;
    return await this.userService.updateUserEmail(req.userId, newEmail);
  }

  @UseGuards(AuthGuard)
  @Post('delete')
  async deleteUser(
    @Body() body: DeleteUserDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const { password } = body;
    return await this.userService.deleteUser(req.userId, password);
  }
}
