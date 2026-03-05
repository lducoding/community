import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'users' })
export class User {
  @PrimaryKey({ type: 'bigint' })
  id!: number;

  @Property({ length: 100, comment: '사용자 이름' })
  username!: string;

  @Property({ length: 500, nullable: true, comment: '프로필 이미지 URL' })
  profileImage?: string;

  @Property({ length: 255, comment: '이메일' })
  email!: string;

  @Property({ length: 20, comment: '생년월일' })
  birthday!: string;

  @Property({ default: 0, comment: '팔로잉 수' })
  followCount: number = 0;

  @Property({ default: 0, comment: '팔로워 수' })
  followerCount: number = 0;

  @Property({ onCreate: () => new Date(), comment: '생성일시' })
  createdAt: Date = new Date();

  @Property({ onCreate: () => new Date(), onUpdate: () => new Date(), comment: '수정일시' })
  updatedAt: Date = new Date();

  @Property({ nullable: true, comment: '삭제일시' })
  deletedAt?: Date;
}
