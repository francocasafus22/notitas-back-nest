import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards, Request, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signIn.auth.dto';
import { Public } from 'src/decorators/public.decorator';
import { GetUser } from 'src/decorators/get-user.decorator';
import { PayloadDto } from './dto/payload-auth.dto';
import { RegisterDto } from './dto/register-auth.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  
  @HttpCode(HttpStatus.OK)
  @Public()
  @Post("login")
  create(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto)
  }

  @Post("register")
  register(@Body() registerDto: RegisterDto){
    return this.authService.register(registerDto)
  }

  @Get("profile")
  getProfile(@GetUser() user: PayloadDto){
    return user
  }

  @Get("me")
  getUserData(@GetUser() user: PayloadDto){
    return this.authService.getPersonalData(user)
  }
}
