import { Controller, Get, Post, Param, Body, Query, UseGuards } from '@nestjs/common';
import { GymsService } from './gyms.service';
import { FirebaseAuthGuard } from '../../auth/firebase-auth.guard';
import { CurrentUser, AuthenticatedUser } from '../../auth/current-user.decorator';

@Controller('api/gyms')
export class GymsController {
  constructor(private readonly gymsService: GymsService) {}

  @Get()
  async listGyms(@Query('city') city?: string, @Query('featured') featured?: string) {
    return this.gymsService.listGyms(city, featured === 'true');
  }

  @Get(':id')
  async getGym(@Param('id') id: string) {
    return this.gymsService.getGymById(id);
  }

  @Post('register')
  @UseGuards(FirebaseAuthGuard)
  async registerGym(@CurrentUser() user: AuthenticatedUser, @Body() data: any) {
    return this.gymsService.registerGym(user, data);
  }

  @Post(':id/reviews')
  @UseGuards(FirebaseAuthGuard)
  async addReview(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') gymId: string,
    @Body() body: { rating: number; comment: string },
  ) {
    return this.gymsService.addReview(user, gymId, body.rating, body.comment);
  }

  @Post(':id/leads')
  @UseGuards(FirebaseAuthGuard)
  async createLead(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') gymId: string,
    @Body() body: { message: string },
  ) {
    return this.gymsService.createLead(user, gymId, body.message);
  }
}
