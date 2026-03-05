export class FeedPostDto {
  id: number;
  userId: number;
  username: string;
  title?: string;
  body?: string;
  type: string;
  createdAt: Date;
}
