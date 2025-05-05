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
import { Request } from 'express';
import { VerifyUserDto } from './dto/verify-user.dto';

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
    let region = await this.client.region.findUnique({where:{id: createUserDto.regionId}})
    if(!region) throw new NotFoundException("region not found")
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
        regionId: null,
        status: 'PANDING',
        role: 'USER',
      },
    });

    return { message: 'User created successfully, otp sent to email', user, otp };
  }

  async verifyOtp(data: VerifyUserDto) {
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
      throw new BadRequestException('wrong OTP');
    }
  }

  async sendOtp(data: {email: string}) {
    let otp = totp.generate(data.email);
    try {
      await this.emailService.sendMail(
        data.email,
        'one time password',
        `your otp is ${otp}`,
      );
    } catch (error) {
      console.log('Error sending email:', error);
      throw new BadRequestException('Failed to send OTP email');
    }
    return { message: 'OTP sent successfully', otp};
  }

  async findAll(){
    return await this.client.user.findMany()
  }

  async findById(id: string){
    let user = await this.client.user.findUnique({where: {id}})
    if(!user) throw new NotFoundException("user not found")
    return 
  }

  async me(req: Request) {
    let ip = req.ip;
    let mySession = await this.client.session.findFirst({
      where: { ip, userId: req['user'] },
    });
    if (!mySession) throw new NotFoundException('session not found');
    let user = await this.client.user.findUnique({
      where: { id: mySession.userId },
    });
    if (!user) throw new NotFoundException('user not found');
    return user;
  }

  async mySessions(req: Request) {
    let sessoins = await this.client.session.findMany({
      where: {
        userId: req['user'],
      },
    });
    return sessoins;
  }

  async deleteSession(id: string, req: Request) {
    let sessoin = await this.client.session.findFirst({
      where: {
        id,
        userId: req['user'],
      },
    });
    if (!sessoin) throw new NotFoundException('session not found');
    let deleted = await this.client.session.delete({ where: { id } });
    return deleted;
  }

  async refreshToken(req: Request) {
    let user = await this.client.user.findUnique({
      where: { id: req['user'] },
    });

    if(!user) throw new NotFoundException("user not found")

    const accessToken = this.jwt.sign({ id: user.id, role: user.role });

    return { accessToken };
  }

  async createSuperAdmin(userId: string){
    let user = await this.client.user.findUnique({where: {id: userId}})
    if(!user) throw new NotFoundException("user not found")
    let superAdmin = await this.client.user.update({where: {id: userId}, data: {role: 'SUPER_ADMIN'}})
    return superAdmin
  }

  async login(data: LoginUserDto, req: Request) {
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
    let session = await this.client.session.findFirst({
      where: {
        ip: req.ip,
        userId: matchUser.id,
      },
    });
    if (!session) {
      await this.client.session.create({
        data: {
          ip: req.ip || '::1',
          data: req.headers['user-agent'] || 'Unknown',
          userId: matchUser.id,
        },
      });
    }
    let accessToken = this.jwt.sign({ id: matchUser.id, role: matchUser.role });
    let refreshToken = this.jwt.sign(
      { id: matchUser.id },
      { secret: 'REFRESH_TOKEN_SECRET', expiresIn: '7d' },
    );

    return { refreshToken, accessToken };
  }
}
