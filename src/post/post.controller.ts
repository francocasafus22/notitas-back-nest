import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
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
    console.log("user in controller findAll", user);
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
    return this.postService.findOne(slug, user);
  }

  @Patch(':id')
  update(@Param('id', ParseMongoIdPipe) id: Types.ObjectId, @Body() updatePostDto: UpdatePostDto, @GetUser() user:PayloadDto) {
    return this.postService.update(id, updatePostDto, user);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: Types.ObjectId, @GetUser() user: PayloadDto) {
    return this.postService.remove(id, user);
  }

  @Post("/like/:postId")
  likePost(@Param('postId', ParseMongoIdPipe) postId: Types.ObjectId, @GetUser() user: PayloadDto){
    return this.postService.likePost(postId, user);
  }

  @Delete("/like/:postId")
  unlikePost(@Param('postId', ParseMongoIdPipe) postId: Types.ObjectId, @GetUser() user: PayloadDto){
    return this.postService.unlikePost(postId, user);
  }
}
