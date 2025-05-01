import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { totp } from 'otplib';
import * as nodemailer from 'nodemailer';
import { MailService } from 'src/mailer/mailer.service';

totp.options = { digits: 5, step: 300 };

@Injectable()
export class UserService {
  constructor(private client: PrismaService, private emailService: MailService) {}
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
      await this.emailService.sendMail(createUserDto.email, "one time password", `your otp is ${otp}`);
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
      },
    });

    return {message: "User created successfully, otp sent to email", user};
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
