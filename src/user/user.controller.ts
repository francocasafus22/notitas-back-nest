import { Controller, Get, Post, Body, Patch, Param, Delete, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from 'src/decorators/public.decorator';
import { GetUser } from 'src/decorators/get-user.decorator';
import { User } from './schemas/user.schema';
import { PayloadDto } from 'src/auth/dto/payload-auth.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get('/profile/:username')
  async findOneByUsername(@Param('username') username: string, @GetUser() user: User) {
    const userFound = await this.userService.findOne({username});
    const isOwner = userFound.username === user.username;
    return {user: userFound, isOwner};
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne({id});
  }

  @Patch()
  update(@Body() updateUserDto: UpdateUserDto, @GetUser() user: PayloadDto) {   
    return this.userService.update(updateUserDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
