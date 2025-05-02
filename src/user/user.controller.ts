import {
  Controller,
  Post,
  Body,
  Req,
  Get,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleD } from './decorators/roles.decorstor';
import { Role } from '@prisma/client';
import { RoleGuard } from 'src/role/role.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Get('refreshToken')
  refresh(@Req() req: Request){
    return this.userService.refreshToken(req)
  }

  @Post('login')
  login(@Body() data: LoginUserDto, @Req() req: Request) {
    return this.userService.login(data, req);
  }
  @Post('send-otp')
  sendOtp(@Body() data: string) {
    return this.userService.sendOtp(data);
  }

  @RoleD(Role.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Post("create Super-Admin/:userId")
  createS(@Param("userId") id: string){
    return this.userService.createSuperAdmin(id)
  }

  @UseGuards(AuthGuard)
  @Get('me')
  me(@Req() req: Request) {
    return this.userService.me(req);
  }

  @UseGuards(AuthGuard)
  @Get('mySessions')
  mySessions(@Req() req: Request) {
    return this.userService.mySessions(req);
  }

  @UseGuards(AuthGuard)
  @Delete('session/:id')
  deleteS(@Param('id') id: string, @Req() req: Request) {
    return this.userService.deleteSession(id, req);
  }

  @Post('verify')
  verify(@Body() data: { email: string; otp: number }) {
    return this.userService.verifyOtp(data);
  }
}
