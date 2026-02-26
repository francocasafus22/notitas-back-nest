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
import slugify from 'slugify';

@Injectable()
export class PostService {

  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    private userService: UserService
  ){}

  private formatPosts(posts: any[], user?: PayloadDto) {
      return posts.map(post => {        
        return {
          ...post,
          likesCount: post.likes?.length || 0,
          likedByUser: user
            ? post.likes?.some(id=>id.toString()===user.userId.toString()) || false
            : false,
          likes: undefined
        };
      });
    }

  async create(createPostDto: CreatePostDto, user: PayloadDto) {
    const userData = await this.userService.getBasicInfo(user.userId);    
    const post = await this.postModel.create({...createPostDto, author: userData._id, authorName: userData.username, authorAvatar: userData.image});
    return post;
  }

  async findAllByUsername(username: string, query: PaginationDto, user?: PayloadDto | undefined) {
    const userExist = await this.userService.findOne({username});    
    const [posts, total] = await Promise.all([
      this.postModel.find({author: userExist._id})
      .sort({createdAt: -1})
      .skip((query.page - 1) * query.limit)
      .limit(query.limit)
      .lean()
      .exec(),
      await this.postModel.countDocuments({author: userExist._id}).exec()
    ])

    return {posts: this.formatPosts(posts, user), total, currentPage: query.page, totalPages: Math.ceil(total / query.limit)};
  }

  async findAll(query: PaginationDto, user?: PayloadDto | undefined) {
  
    const [posts, total] = await Promise.all([
      this.postModel.find()
      .sort({createdAt: -1})
      .skip((query.page - 1) * query.limit)
      .limit(query.limit)
      .lean()
      .exec(),
      this.postModel.countDocuments().exec()
    ])


    return {posts: this.formatPosts(posts, user), total, currentPage: query.page, totalPages: Math.ceil(total / query.limit)};
  }

  async findOne(slug: string, user?: PayloadDto | undefined) {
    const post: Post | null = await this.postModel.findOne({slug}).lean().exec();
    if(!post) throw new NotFoundException("Post not found");
    return this.formatPosts([post], user)[0];
  }

  async update(post: PostDocument, updatePostDto: UpdatePostDto) {
    Object.assign(post, updatePostDto);
    const postUpdated = await post.save();
    return {message: "Post updated successfully", post: postUpdated};
  }

  async remove(id: Types.ObjectId, user: PayloadDto) {
    const post: PostDocument | null = await this.postModel.findById(id).exec();
    if(!post) throw new NotFoundException("Post not found");
    if(!post.author.equals(user.userId)) throw new ForbiddenException("You are not allowed to delete this post");
    await post.deleteOne();
    return {message: "Post deleted"};
  }

  async likePost(postId: Types.ObjectId, user: PayloadDto){    
    const post: PostDocument | null = await this.postModel.findById(postId).exec();    

    if(!post) throw new NotFoundException("Post not found");

    const alreadyLikes = post.likes.some(id=>id.equals(user.userId));

    const updatedPost = await this.postModel.findByIdAndUpdate(postId, alreadyLikes ? 
      { $pull: { likes: user.userId } } :
      { $addToSet: { likes: user.userId } },
      { new: true }
    ).exec();    

    return {message: "Post liked", updatedPost};

  }


}
