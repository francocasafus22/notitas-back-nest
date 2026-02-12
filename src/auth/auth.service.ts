import { ConflictException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { SignInDto } from './dto/signIn.auth.dto';
import { JwtService } from '@nestjs/jwt';
import {compare} from "bcrypt"
import { envs } from 'src/config/envs';
import { PayloadDto } from './dto/payload-auth.dto';
import * as bcrypt from "bcrypt"
import { RegisterDto } from './dto/register-auth.dto';

@Injectable()
export class AuthService {

  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ){}

  async register(registerDto: RegisterDto){
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    try {
      await this.userService.create({...registerDto, password: hashedPassword})
      return{
        message: "User created succcessfully"
      }
    } catch (error) {
      if(error.code == 11000){
        if(error.keyPattern?.username) throw new ConflictException("Username already exists")
        if(error.keyPattern?.email) throw new ConflictException('Email already exists');
      }
      throw error
    }
  }

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
