import { Module } from '@nestjs/common';
import { PostsService } from './services/posts.service';
import { PostsController } from './controllers/posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Post, Category])],
    controllers: [PostsController, CategoriesController],
    providers: [PostsService, CategoriesService],
})
export class PostsModule {}
