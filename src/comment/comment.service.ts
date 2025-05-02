import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';

@Injectable()
export class CommentService {
  constructor(private client: PrismaService) {}
  async create(createCommentDto: CreateCommentDto, req: Request) {
    let userId = req['user'];
    let user = await this.client.user.findUnique({ where: { id: userId } });
    let prd = await this.client.product.findUnique({
      where: { id: createCommentDto.productId },
    });
    if (!user) throw new NotFoundException('user not found');
    if (!prd) throw new NotFoundException('product not found');
    let comment = await this.client.comment.create({
      data: { ...createCommentDto, userId },
    });
    return comment;
  }

  async findAll() {
    let comments = await this.client.comment.findMany();
    return comments;
  }

  async findOne(id: string) {
    let comment = await this.client.comment.findUnique({ where: { id } });
    if (!comment) throw new NotFoundException('comment not found');
    return comment;
  }

  async update(id: string, updateCommentDto: UpdateCommentDto, req: Request) {
    let comment = await this.client.comment.findUnique({ where: { id } });
    if (!comment) throw new NotFoundException('comment not found');
    let userId = req['user'];
    if (comment.userId !== userId)
      throw new UnauthorizedException("u can't changr this comment");
    let changed = await this.client.comment.update({
      where: { id },
      data: updateCommentDto,
    });
    return changed;
  }

  async remove(id: string, req: Request) {
    let comment = await this.client.comment.findUnique({ where: { id } });
    if (!comment) throw new NotFoundException('comment not found');
    let userId = req['user'];
    if (comment.userId !== userId)
      throw new UnauthorizedException("u can't changr this comment");
    let deleted = await this.client.comment.delete({where: {id}})
    return deleted
  }
}
