import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards, Request, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signIn.auth.dto';
import { Public } from 'src/decorators/public.decorator';
import { GetUser } from 'src/decorators/get-user.decorator';
import { PayloadDto } from './dto/payload-auth.dto';
import { RegisterDto } from './dto/register-auth.dto';
import type { Response } from 'express';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  
  @HttpCode(HttpStatus.OK)
  @Public()
  @Post("login")
  async reate(@Body() signInDto: SignInDto, @Res({passthrough: true}) response: Response) {
    const {access_token} = await this.authService.signIn(signInDto)
    response.cookie("access_token", access_token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24
    })

    return{
      message: "Login successful"
    }
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
