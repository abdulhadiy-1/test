import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RegionModule } from './region/region.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { MailerModule } from './mailer/mailer.module';
import { CategoryModule } from './category/category.module';
import { ColorModule } from './color/color.module';
import { ProductModule } from './product/product.module';
import { CommentModule } from './comment/comment.module';
import { OrderModule } from './order/order.module';
import { LikeModule } from './like/like.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MulterController } from './multer/multer.controller';
import { ChatModule } from './chat/chat.module';
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/file',
    }),
    RegionModule,
    PrismaModule,
    UserModule,
    MailerModule,
    CategoryModule,
    ColorModule,
    ProductModule,
    CommentModule,
    OrderModule,
    LikeModule,
    ChatModule,
  ],
  controllers: [AppController, MulterController],
  providers: [AppService],
})
export class AppModule {}
