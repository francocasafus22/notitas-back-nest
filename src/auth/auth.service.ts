import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UserService } from 'src/user/user.service';
import { SignInDto } from './dto/signIn.auth.dto';
import { JwtService } from '@nestjs/jwt';
import {compare} from "bcrypt"
import { envs } from 'src/config/envs';
import { PayloadDto } from './dto/payload-auth.dto';

@Injectable()
export class AuthService {

  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ){}

  async validateUser(username: string, pass:string): Promise<any>{
    const user = await this.userService.findOneByUsername(username);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await compare(pass, user.password)
    if(!isMatch){
      throw new UnauthorizedException("Password not valid");
    }
    
    return {username: user.username, _id: user._id}
  }

  async signIn(signInDto: SignInDto): Promise<{access_token: string}>{
    const user = await this.validateUser(signInDto.username, signInDto.password);
    const payload = {sub: user._id, username: user.username};
    return{
      access_token: await this.jwtService.signAsync(payload)
    }
    
  }

  async getPersonalData(user: PayloadDto){
    return this.userService.findOne(user.userId)
  }
}
