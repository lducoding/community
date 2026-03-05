import { Entity, ManyToOne, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { User } from '../users/user.entity';

@Entity({ tableName: 'follow' })
@Unique({ properties: ['followingUser', 'followedUser'], name: 'uk_following_user_id_followed_user_id' })
export class Follow {
  @PrimaryKey({ type: 'bigint' })
  id!: number;

  @ManyToOne(() => User, { fieldName: 'following_user_id', comment: '팔로우를 한 사용자 id (나)' })
  followingUser!: User;

  @ManyToOne(() => User, { fieldName: 'followed_user_id', comment: '팔로우를 받은 사용자 id (상대방)' })
  followedUser!: User;

  @Property({ onCreate: () => new Date(), default: 'now()', comment: '팔로우 일시' })
  createdAt: Date = new Date();
}
