import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsUUID, MaxLength, MinLength } from "class-validator"

export class CreateCommentDto {
    @ApiProperty()
    @IsUUID()
    productId: string
    @ApiProperty()
    @IsString()
    @MinLength(1)
    @MaxLength(200)
    text: string
}
