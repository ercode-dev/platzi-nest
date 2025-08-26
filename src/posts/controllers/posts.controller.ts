import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { PostsService } from '../services/posts.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { Payload } from 'src/auth/models/payload.model';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @ApiResponse({ status: 201, description: 'Post created successfully' })
    @ApiOperation({ summary: 'Create a post' })
    @UseGuards(AuthGuard('jwt'))
    @Post()
    create(@Body() createPostDto: CreatePostDto, @Req() req: Request) {
        const payload = req.user as Payload;

        return this.postsService.create(createPostDto, payload.sub);
    }

    @ApiResponse({ status: 200, description: 'Posts retrieved successfully' })
    @ApiOperation({ summary: 'Get all posts' })
    @Get()
    findAll() {
        return this.postsService.findAll();
    }

    @ApiOperation({ summary: 'Get a post by id' })
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.postsService.findOne(+id);
    }

    @ApiOperation({ summary: 'Update a post by id' })
    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updatePostDto: UpdatePostDto) {
        return this.postsService.update(+id, updatePostDto);
    }

    @ApiResponse({ status: 200, description: 'Post published successfully' })
    @ApiOperation({ summary: 'Publish a post by id' })
    @UseGuards(AuthGuard('jwt'))
    @Put(':id/publish')
    publish(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
        const payload = req.user as Payload;
        const userId = payload.sub;
        return this.postsService.publish(+id, userId);
    }

    @ApiOperation({ summary: 'Remove a post by id' })
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.postsService.remove(+id);
    }
}
