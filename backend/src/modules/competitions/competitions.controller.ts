import { Controller, Get, Post, Param, Body, Query, UseGuards } from '@nestjs/common';
import { CompetitionsService } from './competitions.service';
import { FirebaseAuthGuard } from '../../auth/firebase-auth.guard';
import { CurrentUser, AuthenticatedUser } from '../../auth/current-user.decorator';

@Controller('api/competitions')
export class CompetitionsController {
  constructor(private readonly compService: CompetitionsService) {}

  @Get()
  async listCompetitions(@Query('city') city?: string) {
    return this.compService.listCompetitions(city);
  }

  @Get(':id')
  async getCompetition(@Param('id') id: string) {
    return this.compService.getCompetitionById(id);
  }

  @Post(':id/register')
  @UseGuards(FirebaseAuthGuard)
  async registerAthlete(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') compId: string,
    @Body() body: { category: string },
  ) {
    return this.compService.registerAthlete(user, compId, body.category);
  }
}
