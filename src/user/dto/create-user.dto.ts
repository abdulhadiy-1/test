import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import {
  IsEmail,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  Matches,
  IsPhoneNumber,
  IsStrongPassword,
  IsUUID,
  IsOptional,
} from 'class-validator';

const CURRENT_YEAR = new Date().getFullYear();
const MIN_YEAR = CURRENT_YEAR - 145; 
const MAX_YEAR = CURRENT_YEAR;

export class CreateUserDto {
  @ApiProperty({
    example: 'john'
  })
  @IsString()
  @MaxLength(50)
  @MinLength(1)
  firstName: string;

  @ApiProperty({
    example: 'doe'
  })
  @IsString()
  @MaxLength(50)
  @MinLength(1)
  lastName: string;

  @ApiProperty({
    example: '1999'
  })
  @IsNumber()
  @Min(MIN_YEAR)
  @Max(MAX_YEAR)
  year: number;

  @ApiProperty({
    example: 'john_doe@doe.com'
  })
  @IsEmail()
  @MaxLength(100)
  email: string;

  @ApiProperty({
    example: 'johnDoe123'
  })
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]+$/, {
    message: 'Пароль должен содержать хотя бы одну букву и одну цифру',
  })
  password: string;

  @ApiProperty({
    example: '+998000000000'
  })
  @IsString()
  @IsPhoneNumber('UZ')
  phone: string;

  @ApiProperty({
    example: 'example.url'
  })
  @IsString()
  @MaxLength(255)
  phot: string;

  @ApiProperty({ enum: Role })
  role: Role;

  @ApiProperty()
  @IsUUID()
  @IsOptional()
  regionId: string;
}
