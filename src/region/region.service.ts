import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RegionService {
  constructor(private client: PrismaService) {}
  async create(createRegionDto: CreateRegionDto) {
    let region = await this.client.region.create({
      data: createRegionDto,
    });
    return region;
  }

  async findAll() {
    let regions = await this.client.region.findMany();
    return regions;
  }

  async findOne(id: string) {
    let region = await this.client.region.findUnique({
      where: {
        id,
      },
    });
    if (!region) {
      throw new NotFoundException('Region not found');
    }

    return region;
  }

  async update(id: string, updateRegionDto: UpdateRegionDto) {
    let region = await this.client.region.findUnique({
      where: {
        id,
      },
    });
    if (!region) {
      throw new NotFoundException('Region not found');
    }
    let updated = await this.client.region.update({
      where: {
        id,
      },
      data: updateRegionDto,
    });
    return updated;
  }

  async remove(id: string) {
    let region = await this.client.region.findUnique({
      where: {
        id,
      },
    });
    if (!region) {
      throw new NotFoundException('Region not found');
    }
    let deleted = await this.client.region.delete({
      where: {
        id,
      },
    });
    return deleted;
  }
}
