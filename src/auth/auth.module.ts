import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UsersModule } from '../users/users.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Env } from 'src/env.model';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
    providers: [AuthService, LocalStrategy, JwtStrategy],
    imports: [
        UsersModule,
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService<Env>) => ({
                secret: configService.get<string>('JWT_SECRET'), // Use the JWT secret from the environment variables
                signOptions: { expiresIn: '12h' },
            }),
        }),
    ],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule {}
