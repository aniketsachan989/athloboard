import { Controller, Get, Post, Body, Query, Param, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { LiftsService } from './lifts.service';
import { FirebaseAuthGuard } from '../../auth/firebase-auth.guard';

@UseGuards(FirebaseAuthGuard)
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

  @Post('submit-video')
  @HttpCode(HttpStatus.CREATED)
  async submitLiftVideo(
    @Body() body: {
      athleteId: string;
      athleteName?: string;
      exercise: string;
      weightKg: number;
      reps?: number;
      videoUrl: string;
    },
  ) {
    return this.liftsService.submitLiftVideo(body);
  }

  @Get('submissions')
  async getSubmissions(@Query('athleteId') athleteId?: string) {
    return this.liftsService.getSubmissions(athleteId);
  }

  @Get('submissions/:id')
  async getSubmissionById(@Param('id') id: string) {
    return this.liftsService.getSubmissionById(id);
  }

  @Get('points/ledger/:athleteId')
  async getAthletePointsLedger(@Param('athleteId') athleteId: string) {
    return this.liftsService.getPointsLedger(athleteId);
  }

  @Get('points/balance/:athleteId')
  async getAthletePointsBalance(@Param('athleteId') athleteId: string) {
    return this.liftsService.getAthletePointsBalance(athleteId);
  }
}
