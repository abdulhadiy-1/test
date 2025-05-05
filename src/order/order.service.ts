import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(private client: PrismaService) {}
  async create(createOrderDto: CreateOrderDto, req: Request) {
    let prd = await this.client.product.findUnique({
      where: { id: createOrderDto.productId },
    });
    if (!prd) throw new NotFoundException('product not found');
    let userId = req['user'];
    if (prd.count < createOrderDto.count)
      throw new BadRequestException(
        `product cound is less than ${createOrderDto.count}`,
      );
    let order = await this.client.order.create({
      data: { ...createOrderDto, userId },
      include: { user: true, product: true },
    });
    await this.client.product.update({
      where: { id: prd.id },
      data: { count: prd.count - createOrderDto.count },
    });
    return order;
  }

  async findAll(req: Request) {
    let myId = req['user'];
    let orders = await this.client.order.findMany({ where: { userId: myId }, include:{ product: true}});
    return orders;
  }

  async findOne(id: string, req: Request) {
    let order = await this.client.order.findFirst({ where: { id, userId: req['user'] }, include: {product: true}});
    if (!order) throw new NotFoundException('order not found');
    return order;
  }

  async remove(id: string, req: Request) {
    let order = await this.client.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException('order not found');
    if (order.userId !== req['user'])
      throw new UnauthorizedException('u cant delete this order');
    let deleted = await this.client.order.delete({where: {id}})
    return deleted
  }
}
