import {
  Controller,
  Post,
  Body,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto);
  }
  @Post('login')
  login(@Body() data: LoginUserDto) {
    return this.userService.login(data);
  }
  @Post('send-otp')
  sendOtp(@Body() data: string) {
    return this.userService.sendOtp(data);
  }

  @Post('verify')
  verify(@Body() data: { email: string; otp: number }) {
    return this.userService.verifyOtp(data);
  }
}
