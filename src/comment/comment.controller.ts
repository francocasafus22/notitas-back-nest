import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { OptionalAuth } from 'src/decorators/optional-auth.decorator';
import { Types } from 'mongoose';
import { ParseMongoIdPipe } from 'src/common';
import { GetUser } from 'src/decorators/get-user.decorator';
import { PayloadDto } from 'src/auth/dto/payload-auth.dto';

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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentService.remove(+id);
  }
}
