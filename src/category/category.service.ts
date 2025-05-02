import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private client: PrismaService) {}
  async create(createCategoryDto: CreateCategoryDto) {
    let category = await this.client.category.create({
      data: createCategoryDto,
    });
    return category;
  }

  async findAll() {
    let categories = await this.client.category.findMany();
    return categories;
  }

  async findOne(id: string) {
    let category = await this.client.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('category not found');
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    let category = await this.client.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('category not found');
    let updated = await this.client.category.update({
      where: { id },
      data: updateCategoryDto,
    });
    return updated;
  }

  async remove(id: string) {
    let category = await this.client.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('category not found');
    let deleted = await this.client.category.delete({ where: { id } });
    return deleted;
  }
}
