import { Controller, Get, Post, Param, Body, Query, UseGuards } from '@nestjs/common';
import { LiftsService } from './lifts.service';
import { FirebaseAuthGuard } from '../../auth/firebase-auth.guard';
import { CurrentUser, AuthenticatedUser } from '../../auth/current-user.decorator';

@Controller('api/lifts')
export class LiftsController {
  constructor(private readonly liftsService: LiftsService) {}

  @Get('leaderboard')
  async getLeaderboard(
    @Query('exercise') exercise?: string,
    @Query('weightClass') weightClass?: string,
    @Query('city') city?: string,
  ) {
    return this.liftsService.getLeaderboard(exercise, weightClass ? parseFloat(weightClass) : undefined, city);
  }

  @Post('sessions')
  @UseGuards(FirebaseAuthGuard)
  async createSession(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: { exercise: string },
  ) {
    return this.liftsService.createSession(user, body.exercise);
  }

  @Post('sessions/:id/sets')
  @UseGuards(FirebaseAuthGuard)
  async logSet(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') sessionId: string,
    @Body() setDto: any,
  ) {
    return this.liftsService.logSet(user, sessionId, setDto);
  }
}
