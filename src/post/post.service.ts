import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { Model, Types } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { PayloadDto } from 'src/auth/dto/payload-auth.dto';
import { NotFoundError } from 'rxjs';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class PostService {

  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    private userService: UserService
  ){}

  async create(createPostDto: CreatePostDto, user: PayloadDto) {
    const userData = await this.userService.getBasicInfo(user.userId);    
    const post = await this.postModel.create({...createPostDto, author: userData._id, authorName: userData.username, authorAvatar: userData.image});
    return post;
  }

  async findAllByUsername(username: string, query: PaginationDto) {
    const userExist = await this.userService.findOne({username});    
    const posts = await this.postModel.find({author: userExist._id})
    .skip((query.page - 1) * query.limit)
    .limit(query.limit)
    .exec();
    const total = await this.postModel.countDocuments({author: userExist._id}).exec();
    return {posts, total, currentPage: query.page, totalPages: Math.ceil(total / query.limit)};
  }

  async findAll(query: PaginationDto) {
    const posts = await this.postModel.find()
    .skip((query.page - 1) * query.limit)
    .limit(query.limit)
    .exec();
    const total = await this.postModel.countDocuments().exec();
    return {posts, total, currentPage: query.page, totalPages: Math.ceil(total / query.limit)};
  }

  async findOne(slug: string): Promise<Post> {
    const post = await this.postModel.findOne({slug}).exec();
    if(!post) throw new NotFoundException("Post not found");
    return post;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  async remove(id: Types.ObjectId, user: PayloadDto) {
    const post: PostDocument | null = await this.postModel.findById(id).exec();
    if(!post) throw new NotFoundException("Post not found");
    console.log("Post author:", post.author, "User ID:", user.userId);
    if(!post.author.equals(user.userId)) throw new ForbiddenException("You are not allowed to delete this post");
    await post.deleteOne();
    return {message: "Post deleted"};
  }
}
