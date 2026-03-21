import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { OptionalAuth } from 'src/decorators/optional-auth.decorator';
import { Types } from 'mongoose';
import { ParseMongoIdPipe } from 'src/common';
import { GetUser } from 'src/decorators/get-user.decorator';
import { PayloadDto } from 'src/auth/dto/payload-auth.dto';
import { OwnershipGuard } from 'src/common/guards/ownership.guard';
import { Comment } from './schemas/comment.schema';
import type { CommentDocument } from './schemas/comment.schema';
import { GetComment } from './decorators/get-comment.decorator';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post(":postId")
  create(@Body() createCommentDto: CreateCommentDto, @GetUser() user: PayloadDto, @Param("postId", ParseMongoIdPipe) postId: Types.ObjectId) {
    return this.commentService.create(createCommentDto, user, postId);
  }

  @OptionalAuth()
  @Get("/:postId")
  findAllByPost(@Param("postId", ParseMongoIdPipe) postId: Types.ObjectId, @GetUser() user?: PayloadDto) {
    return this.commentService.findAllByPost(postId, user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(+id, updateCommentDto);
  }

  @UseGuards(OwnershipGuard(Comment.name))
  @Delete(':id')
  remove(@GetComment() comment: CommentDocument,@GetUser() user: PayloadDto) {
    return this.commentService.remove(comment, user);
  }
}
