import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { UsersModule } from 'src/users/users.module';

@Module({
    providers: [AuthService],
    exports: [AuthService],
    imports: [UsersModule],
})
export class AuthModule {}
