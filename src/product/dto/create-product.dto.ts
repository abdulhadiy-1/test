import { ApiProperty } from "@nestjs/swagger"
import { Status, Types } from "@prisma/client"
import { IsArray, IsEnum, IsNumber, IsString, IsUrl, IsUUID, Max, MaxLength, Min, MinLength } from "class-validator"

export class CreateProductDto {
    @ApiProperty()
    @IsString()
    @MaxLength(150)
    @MinLength(1)
    name: string
    @ApiProperty()
    @IsNumber()
    @Min(1)
    price: number
    @ApiProperty()
    @IsUUID()
    categoryId: string
    @ApiProperty({enum: Types})
    @IsEnum(Types)
    type: Types
    @ApiProperty({enum: Status})
    @IsEnum(Status)
    status: Status
    @ApiProperty()
    @IsArray()
    colors: string[]
    @ApiProperty()
    @IsNumber()
    @Min(1)
    count: number
    @ApiProperty()
    @IsUrl()
    photo: string
    @ApiProperty()
    @IsString()
    @MinLength(1)
    @MaxLength(500)
    description: string
    @ApiProperty()
    @IsNumber()
    @Min(0)
    @Max(100)
    discount: number
}
