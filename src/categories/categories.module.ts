import { Module } from '@nestjs/common';
import { CategoriesController } from './controllers/categories.controller';
import { CategoriesService } from './services/categories.service';
import { Category } from './entities/category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([Category])],
    controllers: [CategoriesController],
    providers: [CategoriesService],
})
export class CategoriesModule {}
