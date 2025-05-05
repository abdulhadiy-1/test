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
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBody } from '@nestjs/swagger';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createChatDto: CreateChatDto, @Req() req: Request) {
    return this.chatService.createChat(createChatDto, req);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@Req() req: Request) {
    return this.chatService.findAllChats(req);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.chatService.findOneChat(id, req);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatService.removeChat(id);
  }
  @Post('message')
  @UseGuards(AuthGuard)
  createMessage(@Body() data: CreateMessageDto, @Req() req: Request) {
    return this.chatService.createMessage(data, req);
  }

  @UseGuards(AuthGuard)
  @Get('message/:chatId')
  findMessages(@Param('chatId') id: string, @Req() req: Request) {
    return this.chatService.findMessages(id, req);
  }

  @Patch('message/:id')
  @UseGuards(AuthGuard)
  @ApiBody({ type: UpdateMessageDto })
  updateMessage(
    @Param('id') id: string,
    @Body() dto: UpdateMessageDto,
    @Req() req: Request,
  ) {
    return this.chatService.updateMessage(id, dto.text, req);
  }
  

  @Delete('message/:id')
  @UseGuards(AuthGuard)
  deleteMessage(@Param('id') id: string, @Req() req: Request) {
    return this.chatService.deleteMessage(id, req);
  }
}