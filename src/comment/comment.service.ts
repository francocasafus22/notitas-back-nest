import { ForbiddenException, Injectable, UnauthorizedException} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from 'src/post/schemas/post.schema';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { PayloadDto } from 'src/auth/dto/payload-auth.dto';
import { UserService } from 'src/user/user.service';
import { PostService } from 'src/post/post.service';

@Injectable()
export class CommentService {

  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    private userService: UserService,
    private postService: PostService
  ){}
  async create(createCommentDto: CreateCommentDto, user: PayloadDto, postId: Types.ObjectId) {
    const userExist = await this.userService.findOne({id: user.userId});
    if(!userExist) throw new UnauthorizedException("User no longer exists");
    await this.postService.findOne({id: postId, user: user});
    
    const comment = new this.commentModel({author: userExist._id, authorName: userExist.username, authorAvatar: userExist.image, post: postId, body: createCommentDto.body});
    comment.save()

    return {
      message: "Comment created successfully"
    }
  }

  async findAllByPost(postId: Types.ObjectId, user?: PayloadDto) {
    const comments = await this.commentModel.find({post: postId}).sort({createdAt: -1}).lean().exec();
    return comments.map(comments=>comments.author._id.equals(user?.userId) ? {...comments, isAuthor: true} : {...comments, isAuthor: false});
    
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  async remove(comment: CommentDocument, user: PayloadDto) {

    await comment.deleteOne();

    return {message: "Comment deleted successfully"};
  }
}
