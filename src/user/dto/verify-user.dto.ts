import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class VerifyUserDto {
  @ApiProperty({
    example: 'john_doe@doe.com'
  })
  @IsEmail()
  email: string
  @ApiProperty()
  otp: string;
}
