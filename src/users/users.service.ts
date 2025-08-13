import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

    async findAll() {
        return await this.userRepository.find({
            relations: ['profile'],
        });
    }

    async findOne(id: number) {
        return await this.getUser(id);
    }

    async getProfileByUserId(id: number) {
        const user = await this.findOne(id);
        return user.profile;
    }

    async getPostsByUserId(id: number) {
        const user = await this.findOne(id);
        return user.profile;
    }

    private async getUser(id: number) {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: ['profile'],
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    async createUser(body: CreateUserDto): Promise<User> {
        try {
            return await this.userRepository.save(body);
        } catch (err) {
            console.error(body, err);
            throw new BadRequestException('Error creating user');
        }
    }

    async deleteUser(id: number) {
        try {
            await this.userRepository.delete(id);
            return {
                message: 'user deleted',
            };
        } catch (e) {
            console.error(e);
            throw new BadRequestException('Error deleting user');
        }
    }

    async modifyUser(id: number, changes: UpdateUserDto) {
        try {
            const user = await this.findOne(id);
            const updatedUser = this.userRepository.merge(user, changes);
            return await this.userRepository.save(updatedUser);
        } catch (e) {
            console.error(e);
            throw new BadRequestException('Error modifying user');
        }
    }
}
