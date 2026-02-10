import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UserService } from 'src/user/user.service';
import { SignInDto } from './dto/signIn.auth.dto';
import { JwtService } from '@nestjs/jwt';
import {compare} from "bcrypt"

@Injectable()
export class AuthService {

  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ){}

  async signIn(signInDto: SignInDto): Promise<{access_token: string}>{
    const user = await this.userService.findOneByUsername(signInDto.username)
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await compare(signInDto.password, user.password)
    if(!isMatch){
      throw new UnauthorizedException("Password not valid");
    }
    
    const payload = {sub: user._id.toString(), username: user.username};
    return{
      access_token: await this.jwtService.signAsync(payload)
    }
    
  }
}
