import { ApiProperty } from "@nestjs/swagger"
import { IsNumber, IsString, IsUUID, Max, MaxLength, Min, MinLength } from "class-validator"

export class CreateCommentDto {
    @ApiProperty()
    @IsUUID()
    productId: string
    @ApiProperty()
    @IsString()
    @MinLength(1)
    @MaxLength(200)
    text: string
    @ApiProperty()
    @IsNumber()
    @Min(0)
    @Max(5)
    star: number
}
