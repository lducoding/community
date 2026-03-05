import { Controller, Get, Post, Param, Body, ParseIntPipe } from '@nestjs/common';
import { FollowService } from './follow.service';

@Controller('users/:id')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post('follow')
  createFollow(
    @Param('id', ParseIntPipe) followedUserId: number,
    @Body('followingUserId', ParseIntPipe) followingUserId: number,
  ) {
    return this.followService.createFollow(followingUserId, followedUserId);
  }

  @Get('followings')
  findFollowings(@Param('id', ParseIntPipe) id: number) {
    return this.followService.findFollowings(id);
  }

  @Get('followers')
  findFollowers(@Param('id', ParseIntPipe) id: number) {
    return this.followService.findFollowers(id);
  }

  @Get('followers/recent')
  findRecentFollowers(@Param('id', ParseIntPipe) id: number) {
    return this.followService.findRecentFollowers(id);
  }
}
