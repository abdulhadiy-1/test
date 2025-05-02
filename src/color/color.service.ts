import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ColorService {
  constructor(private client: PrismaService){}
  async create(createColorDto: CreateColorDto) {
    let color = await this.client.color.create({data: createColorDto})
    return color
  }

  async findAll() {
    let colors = await this.client.color.findMany()
    return colors
  }

  async findOne(id: string) {
    let color = await this.client.color.findUnique({where: {id}})
    if(!color) throw new NotFoundException("color not found")
    return color
  }

  async update(id:string, updateColorDto: UpdateColorDto) {
    let color = await this.client.color.findUnique({where: {id}})
    if(!color) throw new NotFoundException("color not found")
    let updated = await this.client.color.update({where: {id}, data: updateColorDto})
    return updated
  }

  async remove(id: string) {
    let color = await this.client.color.findUnique({where: {id}})
    if(!color) throw new NotFoundException("color not found")
    let deleted = await this.client.color.delete({where: {id}})
    return deleted
  }
}
