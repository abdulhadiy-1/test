import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { Status, Types } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private client: PrismaService) {}
  async create(createProductDto: CreateProductDto, req: Request) {
    let userId = req['user'];
    let prd = await this.client.product.create({
      data: {
        ...createProductDto,
        ownerId: userId,
      },
    });
    return prd;
  }

  async findAll(
    page: number,
    limit: number,
    filter: string,
    category: string,
    status: Status,
    type: Types,
  ) {
    const where: any = {};
  
    const limits = limit || 10;
    const skip = page && limit ? (page - 1) * limits : 0;
  
    if (filter) {
      where.name = { startsWith: filter };
    }
  
    if (category) {
      where.categoryId = category; 
    }
  
    if (status) {
      where.status = status;
    }
  
    if (type) {
      where.type = type;
    }
  
    const products = await this.client.product.findMany({
      where,
      include: {
        Like: true,
        category: true,
        Comment: true,
        Vievs: true,
      },
      skip,
      take: limits,
    });
  
    return products;
  }
  

  async findOne(id: string) {
    let prd = await this.client.product.findUnique({
      where: { id },
      include: { Like: true, category: true, Comment: true, Vievs: true },
    });
    if (!prd) throw new NotFoundException('product not found');
    return prd;
  }

  async update(id: string, updateProductDto: UpdateProductDto, req: Request) {
    let prd = await this.client.product.findUnique({
      where: { id },
      include: { Like: true, category: true, Comment: true, Vievs: true },
    });
    if (!prd) throw new NotFoundException('product not found');
    if (prd.ownerId !== req['user'])
      throw new UnauthorizedException("u can't change this product");
    let newprd = await this.client.product.update({
      where: { id },
      data: {
        ...updateProductDto,
      },
    });
    return newprd;
  }

  async remove(id: string, req: Request) {
    let prd = await this.client.product.findUnique({
      where: { id },
      include: { Like: true, category: true, Comment: true, Vievs: true },
    });
    if (!prd) throw new NotFoundException('product not found');
    if (prd.ownerId !== req['user'])
      throw new UnauthorizedException("u can't delete this product");

    let deleted = await this.client.product.delete({ where: { id } });
    return deleted;
  }

  async viev(id: string, req: Request) {
    let viev = await this.client.vievs.findFirst({
      where: { productId: id, userId: req['user'] },
    });
    if (!viev) {
      let nViev = await this.client.vievs.create({
        data: { userId: req['user'], productId: id },
      });
      return nViev;
    }
    return viev;
  }
}
