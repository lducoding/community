import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly em: EntityManager) {}

  findAll(): Promise<User[]> {
    return this.em.findAll(User);
  }

  findOne(id: number): Promise<User | null> {
    return this.em.findOne(User, { id });
  }
}
