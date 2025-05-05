import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class ChatService {
  constructor(private client: PrismaService) {}
  async createChat(createChatDto: CreateChatDto, req: Request) {
    const fromId = req['user'];
    if (fromId === createChatDto.toId) {
      throw new BadRequestException('You cannot create a chat with yourself.');
    }
    const existingChat = await this.client.chat.findFirst({
      where: {
        OR: [
          { toId: createChatDto.toId, fromId },
          { fromId: createChatDto.toId, toId: fromId },
        ],
      },
      include: {
        from: true,
        to: true,
      },
    });

    if (existingChat)
      return {
        ...existingChat,
        companion:
          existingChat.fromId === fromId ? existingChat.to : existingChat.from,
      };

    const match = await this.client.user.findUnique({
      where: { id: createChatDto.toId },
    });

    if (!match) throw new NotFoundException('User not found');

    const newChat = await this.client.chat.create({
      data: {
        ...createChatDto,
        fromId,
      },
      include: {
        from: true,
        to: true,
      },
    });

    return {
      ...newChat,
      companion: newChat.from.id === fromId ? newChat.to : newChat.from,
    };
  }

  async findAllChats(req: Request) {
    let fromId = req['user'];
    const chats = await this.client.chat.findMany({
      where: {
        OR: [
          {
            fromId,
          },
          {
            toId: fromId,
          },
        ],
      },
      include: {
        from: true,
        to: true,
      },
    });
    const chatsWithCompanion = chats.map((chat) => ({
      ...chat,
      companion: chat.from.id === fromId ? chat.to : chat.from,
    }));
    return chatsWithCompanion;
  }

  async findOneChat(id: string, req: Request) {
    let fromId = req['user'];
    const chat = await this.client.chat.findUnique({
      where: { id },
      include: {
        from: true,
        to: true,
        ChatMessage: true,
      },
    });
    if (!chat) throw new NotFoundException('chat not found');
    return {
      ...chat,
      companion: chat.from.id === fromId ? chat.to : chat.from,
    };
  }

  async removeChat(id: string) {
    const chat = await this.client.chat.findUnique({
      where: { id },
    });
    if (!chat) throw new NotFoundException('chat not found');
    let deleted = await this.client.chat.delete({ where: { id } });
    return deleted;
  }

  async createMessage(data: CreateMessageDto, req: Request) {
    let fromId = req['user'];
    if (fromId === data.toId) {
      throw new BadRequestException('You cannot seend message to yourself.');
    }
    let match = await this.client.chat.findUnique({
      where: { id: data.chatId, toId: data.toId },
    });
    if (!match) throw new NotFoundException('chat not found');
    let Umatch = await this.client.user.findUnique({
      where: { id: data.toId },
    });
    if (!Umatch) throw new NotFoundException('user not found');
    let message = await this.client.chatMessage.create({
      data: { ...data, fromId },
    });
    return message;
  }

  async findMessages(id: string, req: Request) {
    let chat = await this.client.chat.findFirst({
      where: {
        OR: [
          { id, fromId: req['user'] },
          { id, toId: req['user'] },
        ],
      },
    });
    if (!chat) throw new NotFoundException('chat not found');
    let message = await this.client.chatMessage.findMany({
      where: { chatId: id },
    });
    return message;
  }

  async updateMessage(id: string, text: string, req: Request) {
    const myId = req['user'];
    const message = await this.client.chatMessage.findFirst({
      where: { id, fromId: myId },
    });
  
    if (!message) throw new NotFoundException('message not found');
    if (!text) return message;
  
    const updated = await this.client.chatMessage.update({
      where: { id },
      data: {
        message: text 
      },
    });
  
    return updated;
  }
  

  async deleteMessage(id: string, req: Request) {
    const myId = req['user'];

    const message = await this.client.chatMessage.findFirst({
      where: { id, fromId: myId },
    });

    if (!message) throw new NotFoundException('Message not found');

    await this.client.chatMessage.delete({
      where: { id },
    });

    return { message: 'Message deleted successfully', id };
  }
}
