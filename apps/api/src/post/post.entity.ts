import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { User } from '../users/user.entity';

@Entity({ tableName: 'post' })
export class Post {
  @PrimaryKey({ type: 'bigint' })
  id!: number;

  @ManyToOne(() => User, { fieldName: 'user_id', comment: '작성자 userId' })
  user!: User;

  @Property({ length: 500, nullable: true, comment: '제목' })
  title?: string;

  @Property({ columnType: 'text', nullable: true, comment: '본문 내용' })
  body?: string;

  @Property({ columnType: 'json', nullable: true, comment: '첨부 이미지 URL 목록' })
  imageUrls?: string[];

  @Property({ length: 50, comment: '게시글 유형' })
  type!: string;

  @Property({ length: 50, comment: '게시글 상태 (OPEN, HIDDEN, DELETED 등)' })
  state!: string;

  @Property({ default: 0, comment: '댓글 수' })
  commentCount: number = 0;

  @Property({ onCreate: () => new Date(), comment: '생성일시' })
  createdAt: Date = new Date();

  @Property({ onCreate: () => new Date(), onUpdate: () => new Date(), comment: '수정일시' })
  updatedAt: Date = new Date();

  @Property({ nullable: true, comment: '삭제일시' })
  deletedAt?: Date;
}
