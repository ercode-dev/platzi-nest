import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { CreateCategoryDto } from '../dto/create-category.dto';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private categoryRepo: Repository<Category>,
    ) {}

    findAll() {
        return this.categoryRepo.find();
    }

    async findOne(id: number) {
        const category = await this.categoryRepo.findOneBy({ id });
        if (!category) {
            throw new NotFoundException(`Category #${id} not found`);
        }
        return category;
    }

    create(data: CreateCategoryDto) {
        const newCategory = this.categoryRepo.create(data);
        return this.categoryRepo.save(newCategory);
    }

    async update(id: number, changes: UpdateCategoryDto) {
        const category = await this.findOne(id);
        this.categoryRepo.merge(category, changes);
        return this.categoryRepo.save(category);
    }

    async remove(id: number) {
        await this.findOne(id);
        return this.categoryRepo.delete(id);
    }
}
