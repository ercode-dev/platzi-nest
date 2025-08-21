import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { DeepPartial, Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { OpenaiService } from '../../ai/services/openai.service';
import { InternalServerError } from 'openai';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Post) private postsRepository: Repository<Post>,
        private openaiService: OpenaiService,
    ) {}

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

    async create(createPostDto: CreatePostDto, userId: number) {
        try {
            const body = {
                ...createPostDto,
                user: { id: userId },
                categories: createPostDto.categories?.map((id) => ({ id })),
            };
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

    async publish(id: number, userId: number) {
        const post = await this.findOne(id);

        if (post.user.id !== userId) {
            throw new NotFoundException('Post not found');
        }

        if (!post.content || !post.title || post.categories?.length === 0) {
            throw new BadRequestException('Post must have content, title, and at least one category to be published');
        }

        try {
            const summary = await this.openaiService.generateSummary(post.content);
            if (summary) {
                const image = await this.openaiService.generateImage(summary);
                const publishedPost = this.postsRepository.merge(post, { isPublished: true, summary, image } as DeepPartial<Post>);
                await this.postsRepository.save(publishedPost);
            }
        } catch (error) {
            console.error('Error publishing post:', error);
        }

        return this.findOne(id);
    }
}
