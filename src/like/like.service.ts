import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateLikeDto } from './dto/create-like.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';

@Injectable()
export class LikeService {
  constructor(private client: PrismaService) {}
  async create(createLikeDto: CreateLikeDto, req: Request) {
    let prd = await this.client.product.findUnique({
      where: { id: createLikeDto.productId },
    });
    if (!prd) throw new NotFoundException('product not found');
    let like = await this.client.like.findFirst({
      where: { productId: prd.id, userId: req['user'] },
      include: { product: true, user: true },
    });
    if (!like) {
      let a = await this.client.like.create({
        data: { productId: prd.id, userId: req['user'] },
        include: { product: true, user: true },
      });
      return a;
    }
    return like;
  }

  async findAll(req: Request) {
    let likes = await this.client.order.findMany({
      where: { userId: req['user'] },
      include: { product: true, user: true },
    });
    return likes;
  }

  async findOne(id: string) {
    let like = await this.client.like.findUnique({
      where: { id },
      include: { product: true, user: true },
    });
    if (!like) throw new NotFoundException('like not found');
    return like;
  }

  async remove(id: string, req: Request) {
    let like = await this.client.like.findUnique({ where: { id } });
    if (!like) throw new NotFoundException('like not found');
    if (like.userId !== req['user'])
      throw new UnauthorizedException("u can't delete this like");
    let deleted = await this.client.like.delete({
      where: { id },
      include: { product: true, user: true },
    });
    return deleted;
  }
}
