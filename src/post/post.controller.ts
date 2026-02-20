import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { GetUser } from 'src/decorators/get-user.decorator';
import { PayloadDto } from 'src/auth/dto/payload-auth.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ParseMongoIdPipe } from 'src/common';
import { Types } from 'mongoose';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto, @GetUser() user: PayloadDto) {
    return this.postService.create(createPostDto, user);
  }

  @Get()
  findAll(@Query() query: PaginationDto) {
    return this.postService.findAll(query);
  }

  @Get("/user/:username")
  findAllByUsername(@Param("username") username: string, @Query() query: PaginationDto) {
    return this.postService.findAllByUsername(username, query);
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.postService.findOne(slug);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: Types.ObjectId, @GetUser() user: PayloadDto) {
    return this.postService.remove(id, user);
  }
}
