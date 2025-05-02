import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsUUID, Min } from "class-validator";

export class CreateOrderDto {
    @ApiProperty()
    @IsUUID()
    productId: string
    @ApiProperty()
    @IsNumber()
    @Min(1)
    count: number
}
