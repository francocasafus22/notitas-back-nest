import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './schemas/post.schema';
import { Model } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { PayloadDto } from 'src/auth/dto/payload-auth.dto';
import { NotFoundError } from 'rxjs';

@Injectable()
export class PostService {

  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    private userService: UserService
  ){}

  async create(createPostDto: CreatePostDto, user: PayloadDto) {
    const userData = await this.userService.getBasicInfo(user.userId);
    const post = await this.postModel.create({...createPostDto, author: user.userId, authorName: userData.username, authorAvatar: userData.image});
    return post;
  }

  async findAllByUsername(username: string) {
    const userExist = await this.userService.findOne({username});
    const posts = await this.postModel.find({author: userExist._id}).exec();
    return posts;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
