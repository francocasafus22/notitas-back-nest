import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import {hash} from "bcrypt"
import { RegisterDto } from 'src/auth/dto/register-auth.dto';

@Injectable()
export class UserService {

  constructor(
    @InjectModel(User.name) private userModel: Model<User>
  ){}

  async create(registerDto: RegisterDto): Promise<User> {
    const newUser = new this.userModel(registerDto)
    return newUser.save()
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec()
  }

  async findOne({id, username} : { id?: string, username?: string }): Promise<UserDocument>{
    const query = id ? { _id: id } : {username: username}
    const userExist = await this.userModel.findOne(query).select("-password").exec()
    if(!userExist) throw new NotFoundException("User not found")
    return userExist
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: string){
    const user = await this.findOne({id})
    await user.deleteOne()
    return {message: "User deleted successfully"};
  }
}
