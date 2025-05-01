import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { totp } from 'otplib';
import { MailService } from 'src/mailer/mailer.service';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';

totp.options = { digits: 5, step: 300 };

@Injectable()
export class UserService {
  constructor(
    private client: PrismaService,
    private emailService: MailService,
    private jwt: JwtService,
  ) {}
  async register(createUserDto: CreateUserDto) {
    let matchUser = await this.client.user.findFirst({
      where: {
        OR: [{ email: createUserDto.email }, { phone: createUserDto.phone }],
      },
    });
    if (matchUser) {
      throw new BadRequestException(
        'User already exists with this email or phone number',
      );
    }
    let isAdmin = createUserDto.role === 'ADMIN';
    if (!isAdmin && !createUserDto.regionId) {
      throw new BadRequestException(
        'Region ID is required for non-admin users',
      );
    }
    let otp = totp.generate(createUserDto.email);
    try {
      await this.emailService.sendMail(
        createUserDto.email,
        'one time password',
        `your otp is ${otp}`,
      );
    } catch (error) {
      console.log('Error sending email:', error);
      throw new BadRequestException('Failed to send OTP email');
    }
    let hash = bcrypt.hashSync(createUserDto.password, 10);
    let user = await this.client.user.create({
      data: {
        ...createUserDto,
        password: hash,
        ...(isAdmin ? {} : { regionId: createUserDto.regionId }),
        status: 'PANDING',
      },
    });

    return { message: 'User created successfully, otp sent to email', user };
  }

  async verifyOtp(data) {
    try {
      let email = data.email;
      let otp = data.otp;
      const user = await this.client.user.findUnique({ where: { email } });
      if (!user) {
        throw new BadRequestException('User not found');
      }

      const match = totp.verify({ token: otp, secret: email });

      if (!match) {
        console.log('Wrong OTP');
        throw new BadRequestException('Wrong OTP');
      }
      await this.client.user.update({
        where: { email },
        data: { status: 'ACTIVE' },
      });
      return { message: 'otp verified' };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Something went wrong with OTP');
    }
  }

  async sendOtp(email: string) {
    let otp = totp.generate(email);
    try {
      await this.emailService.sendMail(
        email,
        'one time password',
        `your otp is ${otp}`,
      );
    } catch (error) {
      console.log('Error sending email:', error);
      throw new BadRequestException('Failed to send OTP email');
    }
    return { message: 'OTP sent successfully' };
  }

  async login(data: LoginUserDto) {
    let matchUser = await this.client.user.findUnique({
      where: { email: data.email },
    });
    if (!matchUser) {
      throw new NotFoundException('User not exist');
    }
    if (matchUser.status !== 'ACTIVE') {
      throw new BadRequestException('verify your email');
    }
    let matchPassword = bcrypt.compareSync(data.password, matchUser.password);
    if (!matchPassword) {
      throw new BadRequestException('wrong password');
    }
    let token = this.jwt.sign({ id: matchUser.id });
    return { token };
  }
}
