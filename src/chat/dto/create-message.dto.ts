import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, MinLength } from 'class-validator';

export class CreateMessageDto {
  @IsUUID()
  @ApiProperty()
  toId: string;
  @ApiProperty()
  @IsUUID()
  chatId: string;
  @ApiProperty()
  @MinLength(1)
  message: string;
}