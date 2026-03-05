import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { PostService } from './post.service';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Get('feed/:userId')
  findFeed(@Param('userId', ParseIntPipe) userId: number) {
    return this.postService.findFeedPosts(userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postService.findOne(id);
  }
}
