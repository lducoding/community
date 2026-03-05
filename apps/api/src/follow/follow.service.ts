import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { Follow } from './follow.entity';

@Injectable()
export class FollowService {
  constructor(private readonly em: EntityManager) {}

  findFollowings(followingUserId: number): Promise<Follow[]> {
    return this.em.find(Follow, { followingUser: { id: followingUserId } }, { populate: ['followedUser'] });
  }

  findFollowers(followedUserId: number): Promise<Follow[]> {
    return this.em.find(Follow, { followedUser: { id: followedUserId } }, { populate: ['followingUser'] });
  }
}
