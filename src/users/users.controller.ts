import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    @Get()
    getUsers() {
        return this.userService.findAll();
    }

    @Get(':id')
    getUsersById(@Param('id', ParseIntPipe) id: number) {
        return this.userService.findOne(id);
    }

    @Get(':id/profile')
    getProfileByUserId(@Param('id', ParseIntPipe) id: number) {
        return this.userService.getProfileByUserId(id);
    }

    @Get(':id/posts')
    getPostsByUserId(@Param('id', ParseIntPipe) id: number) {
        return this.userService.getPostsByUserId(id);
    }

    @Post()
    createUser(@Body() body: CreateUserDto) {
        return this.userService.createUser(body);
    }

    @Delete(':id')
    deleteUser(@Param('id', ParseIntPipe) id: number) {
        return this.userService.deleteUser(id);
    }

    @Put(':id')
    modifyUser(@Param('id', ParseIntPipe) id: number, @Body() changes: UpdateUserDto) {
        return this.userService.modifyUser(id, changes);
    }
}
