import { EntityRepository } from '@mikro-orm/postgresql';
import { Post } from './post.entity';
import { Follow } from '../follow/follow.entity';

export class PostRepository extends EntityRepository<Post> {
  async findFeedPosts(userId: number): Promise<Post[]> {
    const followedUsersSubQuery = this.em
      .createQueryBuilder(Follow, 'follow')
      .select('follow.followed_user_id')
      .where({ followingUser: userId })
      .getKnexQuery();

    return this.em
      .createQueryBuilder(Post, 'post')
      .joinAndSelect('post.user', 'user')
      .where({ 'post.user': { $in: followedUsersSubQuery } })
      .orderBy({ 'post.createdAt': 'DESC' })
      .limit(10)
      .getResultList();
  }
}
