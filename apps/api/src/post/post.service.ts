import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Post } from './post.entity';
import { PostRepository } from './post.repository';
import { FeedPostDto } from './dto/feed-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: PostRepository,
  ) {}

  findAll(): Promise<Post[]> {
    return this.postRepository.findAll();
  }

  findOne(id: number): Promise<Post | null> {
    return this.postRepository.findOne({ id });
  }

  async findFeedPosts(userId: number): Promise<FeedPostDto[]> {
    const posts = await this.postRepository.findFeedPosts(userId);
    return posts.map((post) => ({
      id: post.id,
      userId: post.user.id,
      username: post.user.username,
      title: post.title,
      body: post.body,
      type: post.type,
      createdAt: post.createdAt,
    }));
  }
}
