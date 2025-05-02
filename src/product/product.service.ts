import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

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

  async findAll() {
    let prd = await this.client.product.findMany({
      include: { Like: true, category: true, Comment: true, Vievs: true},
    });
    return prd;
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

    let deleted = await this.client.product.delete({where: {id}})
    return deleted
  }

  async viev(id: string, req: Request){
    let viev = await this.client.vievs.findFirst({where: {productId: id, userId: req['user']}})
    if(!viev){
      let nViev = await this.client.vievs.create({data: {userId: req['user'], productId: id}})
      return nViev

    }
    return viev
  }

}
