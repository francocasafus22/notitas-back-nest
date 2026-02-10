import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signIn.auth.dto';
import { AuthGuard } from './auth.guard';
import { Public } from 'src/decorators/public.decorator';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  
  @HttpCode(HttpStatus.OK)
  @Public()
  @Post("login")
  create(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto)
  }

  @UseGuards(AuthGuard)
  @Get("profile")
  getProfile(@Request() req){
    return req.user
  }

}
