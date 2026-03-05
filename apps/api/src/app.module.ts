import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Migrator } from '@mikro-orm/migrations';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { FollowModule } from './follow/follow.module';
import { PostModule } from './post/post.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MikroOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        driver: require('@mikro-orm/postgresql').PostgreSqlDriver,
        host: config.get('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        dbName: config.get('DB_NAME', 'follow'),
        user: config.get('DB_USER', 'postgres'),
        password: config.get('DB_PASSWORD', ''),
        entities: ['dist/**/*.entity.js'],
        entitiesTs: ['src/**/*.entity.ts'],
        extensions: [Migrator],
        migrations: {
          path: 'dist/migrations',
          pathTs: 'src/migrations',
        },
        debug: config.get('NODE_ENV') !== 'production',
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    FollowModule,
    PostModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
