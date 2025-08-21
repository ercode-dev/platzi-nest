import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { DeepPartial, Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PostsService {
    constructor(@InjectRepository(Post) private postsRepository: Repository<Post>) {}

    async findAll() {
        return await this.postsRepository.find({
            relations: ['user.profile', 'categories'],
        });
    }

    async findOne(id: number) {
        const post = await this.postsRepository.findOne({
            where: { id },
            relations: ['user.profile', 'categories'],
        });

        if (post) {
            return post;
        }

        throw new NotFoundException('Post not found');
    }

    async create(createPostDto: CreatePostDto) {
        try {
            const body = {
                ...createPostDto,
                user: { id: createPostDto.userId },
                categories: createPostDto.categories?.map((id) => ({ id })),
            };
            console.log('Creating post with body:', body);
            const savedPost = await this.postsRepository.save(body);
            return await this.findOne(savedPost.id);
        } catch (e) {
            console.error(e);
            throw new BadRequestException('Error creating post');
        }
    }

    async update(id: number, updatePostDto: UpdatePostDto) {
        try {
            const actualPost: Post = await this.findOne(id);
            const newPost: Post = this.postsRepository.merge(actualPost, updatePostDto as DeepPartial<Post>);
            const savedPost: Post = await this.postsRepository.save(newPost);
            return savedPost;
        } catch (e) {
            console.error(e);
            throw new BadRequestException('Error modifying post');
        }
    }

    async remove(id: number) {
        try {
            await this.postsRepository.delete(id);
            return { message: 'Post removed' };
        } catch (e) {
            console.error(e);
            throw new BadRequestException('Error deleting post');
        }
    }

    async getPostsByCategory(categoryId: number) {
        const posts = await this.postsRepository.find({
            where: { categories: { id: categoryId } },
            relations: ['user.profile'],
        });

        if (posts.length === 0) {
            throw new NotFoundException('No posts found for this category');
        }

        return posts;
    }
}
