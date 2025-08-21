import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/services/users.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    async validateUser(email: string, password: string): Promise<User | null> {
        const user = await this.usersService.getUserByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Unauthorized');
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (user && isMatch) {
            return user;
        }

        throw new UnauthorizedException('Unauthorized');
    }

    generateToken(user: User) {
        const payload = { sub: user.id };
        return this.jwtService.sign(payload);
    }
}
