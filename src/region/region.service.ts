import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RegionService {
  constructor(private client: PrismaService) {}
  create(createRegionDto: CreateRegionDto) {
    let region = this.client.region.create({
      data: createRegionDto,
    });
    return region;
  }

  findAll() {
    let regions = this.client.region.findMany();
    return regions;
  }

  findOne(id: string) {
    let region = this.client.region.findUnique({
      where: {
        id,
      },
    });
    if (!region) {
      throw new NotFoundException('Region not found');
    }

    return region;
  }

  update(id: string, updateRegionDto: UpdateRegionDto) {
    let region = this.client.region.findUnique({
      where: {
        id,
      },
    });
    if (!region) {
      throw new NotFoundException('Region not found');
    }
    let updated = this.client.region.update({
      where: {
        id,
      },
      data: updateRegionDto,
    });
    return updated;
  }

  remove(id: string) {
    let region = this.client.region.findUnique({
      where: {
        id,
      },
    });
    if (!region) {
      throw new NotFoundException('Region not found');
    }
    let deleted = this.client.region.delete({
      where: {
        id,
      },
    });
    return deleted;
  }
}
