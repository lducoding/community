import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { Post } from './post.entity';

@Injectable()
export class PostService {
  constructor(private readonly em: EntityManager) {}

  findAll(): Promise<Post[]> {
    return this.em.findAll(Post);
  }

  findOne(id: number): Promise<Post | null> {
    return this.em.findOne(Post, { id });
  }

  findByUser(userId: number): Promise<Post[]> {
    return this.em.find(Post, { user: { id: userId } });
  }
}
