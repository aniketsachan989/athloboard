import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { RewardsService } from './rewards.service';
import { FirebaseAuthGuard } from '../../auth/firebase-auth.guard';
import { CurrentUser, AuthenticatedUser } from '../../auth/current-user.decorator';

@Controller('api/rewards')
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Get('catalog')
  async getCatalog() {
    return this.rewardsService.getCatalog();
  }

  @Get('my-points')
  @UseGuards(FirebaseAuthGuard)
  async getMyPoints(@CurrentUser() user: AuthenticatedUser) {
    return this.rewardsService.getMyPoints(user);
  }

  @Post('redeem/:id')
  @UseGuards(FirebaseAuthGuard)
  async redeemReward(@CurrentUser() user: AuthenticatedUser, @Param('id') rewardId: string) {
    return this.rewardsService.redeemReward(user, rewardId);
  }
}
