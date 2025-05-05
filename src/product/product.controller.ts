import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Request } from 'express';
import { RoleD } from 'src/user/decorators/roles.decorstor';
import { AuthGuard } from 'src/auth/auth.guard';
import { Status, Types } from '@prisma/client';
import { ApiBody, ApiQuery } from '@nestjs/swagger';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createProductDto: CreateProductDto, @Req() req: Request) {
    return this.productService.create(createProductDto, req);
  }

  @Get()
  @ApiQuery({ name: 'page', default: 1, required: false })
  @ApiQuery({ name: 'limit', default: 10, required: false })
  @ApiQuery({ name: 'filter', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'status', required: false, enum: Status })
  @ApiQuery({ name: 'type', required: false, enum: Types })
  findAll(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('filter') filter: string,
    @Query('category') category: string,
    @Query('status') status: Status,
    @Query('type') type: Types,
  ) {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;

    return this.productService.findAll(
      pageNum,
      limitNum,
      filter,
      category,
      status,
      type,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Req() req: Request,
  ) {
    return this.productService.update(id, updateProductDto, req);
  }
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.productService.remove(id, req);
  }

  @UseGuards(AuthGuard)
  @Post('addViev')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        productId: { type: 'string' },
      },
    },
  })
  addViev(@Body() id: string, @Req() req: Request) {
    return this.productService.viev(id, req);
  }
}
