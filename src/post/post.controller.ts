import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { GetUser } from 'src/decorators/get-user.decorator';
import { PayloadDto } from 'src/auth/dto/payload-auth.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ParseMongoIdPipe } from 'src/common';
import { Types } from 'mongoose';
import { Public } from 'src/decorators/public.decorator';
import { OptionalAuth } from 'src/decorators/optional-auth.decorator';
import { ParsePostPipe } from './pipes/parse-post.pipe';
import type { PostDocument } from './schemas/post.schema';
import { GetPost } from './decorators/get-post.decorator';
import { OwnershipGuard } from 'src/common/guards/ownership.guard';
import { Post as PostSchema } from './schemas/post.schema';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto, @GetUser() user: PayloadDto) {
    return this.postService.create(createPostDto, user);
  }

  @OptionalAuth()
  @Get()
  findAll(@Query() query: PaginationDto, @GetUser() user?: PayloadDto) {
    return this.postService.findAll(query, user);
  }

  @OptionalAuth()
  @Get("/user/:username")
  findAllByUsername(@Param("username") username: string, @Query() query: PaginationDto, @GetUser() user?: PayloadDto){ 
    return this.postService.findAllByUsername(username, query, user);
  }

  @OptionalAuth()
  @Get(':slug')
  findOne(@Param('slug') slug: string, @GetUser() user?: PayloadDto) {
    return this.postService.findOne({slug, user});
  }

  @UseGuards(OwnershipGuard(PostSchema.name))
  @Patch(':id')
  update(@GetPost() post: PostDocument, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(post, updatePostDto);
  }

  @UseGuards(OwnershipGuard(PostSchema.name))
  @Delete(':id')
  remove(@GetPost() post: PostDocument, id: Types.ObjectId, @GetUser() user: PayloadDto) {
    return this.postService.remove(id, user);
  }

  @Post("/like/:postId")
  likePost(@Param('postId', ParsePostPipe) post: PostDocument, @GetUser() user: PayloadDto){
    return this.postService.likePost(post, user);
  }
}
