import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { FollowService } from './follow.service';

@Controller('users/:id')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Get('followings')
  findFollowings(@Param('id', ParseIntPipe) id: number) {
    return this.followService.findFollowings(id);
  }

  @Get('followers')
  findFollowers(@Param('id', ParseIntPipe) id: number) {
    return this.followService.findFollowers(id);
  }
}
