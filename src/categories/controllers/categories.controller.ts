import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { CategoriesService } from '../services/categories.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @Get()
    findAll() {
        return this.categoriesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.categoriesService.findOne(id);
    }

    @Post()
    create(@Body() payload: CreateCategoryDto) {
        return this.categoriesService.create(payload);
    }

    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() payload: UpdateCategoryDto) {
        return this.categoriesService.update(id, payload);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.categoriesService.remove(id);
    }
}
