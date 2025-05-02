import { ApiProperty } from "@nestjs/swagger"
import { Types } from "@prisma/client"
import { IsEnum, IsString, MaxLength, MinLength } from "class-validator"

export class CreateCategoryDto {
    @ApiProperty()
    @IsString()
    @MaxLength(50)
    @MinLength(1)
    name: string
    @ApiProperty({enum: Types})
    @IsEnum(Types)
    type: Types
}