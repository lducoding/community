import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Post } from './post.entity';
import { PostService } from './post.service';
import { PostController } from './post.controller';

@Module({
  imports: [MikroOrmModule.forFeature([Post])],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
