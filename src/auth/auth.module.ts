import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UsersModule } from '../users/users.module';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
    providers: [AuthService, LocalStrategy],
    imports: [UsersModule, PassportModule],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule {}
