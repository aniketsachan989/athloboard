import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { FirebaseAuthGuard } from '../../auth/firebase-auth.guard';
import { CurrentUser, AuthenticatedUser } from '../../auth/current-user.decorator';

@Controller('api/users')
@UseGuards(FirebaseAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMyProfile(@CurrentUser() user: AuthenticatedUser) {
    return this.usersService.getProfile(user);
  }

  @Patch('profile')
  async updateMyProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body() updateDto: any,
  ) {
    return this.usersService.updateProfile(user, updateDto);
  }
}
