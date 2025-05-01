import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RegionModule } from './region/region.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { MailerModule } from './mailer/mailer.module';

@Module({
  imports: [RegionModule, PrismaModule, UserModule, MailerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
