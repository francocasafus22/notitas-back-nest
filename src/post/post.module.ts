import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { Post, PostSchema } from './schemas/post.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';


@Module({
  imports: [MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]), UserModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
