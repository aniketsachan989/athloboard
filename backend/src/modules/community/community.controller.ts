import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { CommunityService } from './community.service';
import { FirebaseAuthGuard } from '../../auth/firebase-auth.guard';
import { CurrentUser, AuthenticatedUser } from '../../auth/current-user.decorator';

@Controller('api/community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @Get('feed')
  async getFeed() {
    return this.communityService.listFeed();
  }

  @Post('posts')
  @UseGuards(FirebaseAuthGuard)
  async createPost(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: { content: string; mediaUrls?: string[]; liftSetId?: string },
  ) {
    return this.communityService.createPost(user, body.content, body.mediaUrls, body.liftSetId);
  }

  @Post('posts/:id/like')
  @UseGuards(FirebaseAuthGuard)
  async toggleLike(@CurrentUser() user: AuthenticatedUser, @Param('id') postId: string) {
    return this.communityService.toggleLike(user, postId);
  }

  @Post('posts/:id/comment')
  @UseGuards(FirebaseAuthGuard)
  async addComment(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') postId: string,
    @Body() body: { content: string },
  ) {
    return this.communityService.addComment(user, postId, body.content);
  }
}
