import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator";

export class CreateColorDto {
  @ApiProperty()
  @IsString()
  @MaxLength(50)
  @MinLength(1)
  name: string;
}
