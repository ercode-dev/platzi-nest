import { Module } from '@nestjs/common';
import { PostsService } from './services/posts.service';
import { PostsController } from './controllers/posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { AiModule } from '../ai/ai.module';

@Module({
    exports: [PostsService],
    imports: [TypeOrmModule.forFeature([Post]), AiModule],
    controllers: [PostsController],
    providers: [PostsService],
})
export class PostsModule {}
