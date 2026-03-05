import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { UniqueConstraintViolationException } from '@mikro-orm/core';
import { Follow } from './follow.entity';
import { User } from '../users/user.entity';

@Injectable()
export class FollowService {
  constructor(private readonly em: EntityManager) {}

  findFollowings(followingUserId: number): Promise<Follow[]> {
    return this.em.find(Follow, { followingUser: { id: followingUserId } }, { populate: ['followedUser'] });
  }

  findFollowers(followedUserId: number): Promise<Follow[]> {
    return this.em.find(Follow, { followedUser: { id: followedUserId } }, { populate: ['followingUser'] });
  }

  async findRecentFollowers(followedUserId: number) {
    const follows = await this.em.find(
      Follow,
      { followedUser: { id: followedUserId } },
      { orderBy: { createdAt: 'DESC' }, limit: 10 },
    );
    return follows.map((f) => ({
      followingUserId: f.followingUser.id,
      createdAt: f.createdAt,
    }));
  }

  async createFollow(followingUserId: number, followedUserId: number) {
    const [followingUser, followedUser] = await Promise.all([
      this.em.findOne(User, { id: followingUserId }),
      this.em.findOne(User, { id: followedUserId }),
    ]);

    if (!followingUser) throw new NotFoundException(`User ${followingUserId} not found`);
    if (!followedUser) throw new NotFoundException(`User ${followedUserId} not found`);

    const follow = this.em.create(Follow, { followingUser, followedUser, createdAt: new Date() });

    followingUser.followCount += 1;
    followedUser.followerCount += 1;

    try {
      await this.em.persistAndFlush([follow, followingUser, followedUser]);
    } catch (e) {
      if (e instanceof UniqueConstraintViolationException) {
        throw new ConflictException('이미 팔로우한 유저입니다.');
      }
      throw e;
    }

    return {
      followingUserId: followingUser.id,
      followedUserId: followedUser.id,
      createdAt: follow.createdAt,
    };
  }
}
