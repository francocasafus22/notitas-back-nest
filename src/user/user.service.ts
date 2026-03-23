import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, type UserDocument } from './schemas/user.schema';
import { Model, Types } from 'mongoose';
import {hash} from "bcrypt"
import { RegisterDto } from 'src/auth/dto/register-auth.dto';
import { GetUser } from 'src/decorators/get-user.decorator';
import { PayloadDto } from 'src/auth/dto/payload-auth.dto';
import slugify from 'slugify';

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

  async getBasicInfo(userId: Types.ObjectId){
    const user = await this.userModel.findById(userId).select("username image").lean().exec()    
    if(!user) throw new NotFoundException("User not found")
    return user
  }

  async findOne({id, username} : { id?: Types.ObjectId, username?: string }): Promise<UserDocument>{
    if(!id && !username) throw new BadRequestException("You must provide an id or username")
    const query = id ? { _id: id } : {username: username}
    const userExist = await this.userModel.findOne(query).select("-password").exec()
    if(!userExist) throw new NotFoundException("User not found")
    return userExist
  }

  async update(updateUserDto: UpdateUserDto, user: PayloadDto) {
    const userExist = await this.userModel.findOne({_id: user.userId}).exec()
    if(!userExist) throw new NotFoundException("User not found")
    
    Object.assign(userExist, updateUserDto)
    await userExist.save()
    return {message: "User updated successfully", username: userExist.username};
  }

  async remove(id: Types.ObjectId){
    const user = await this.findOne({id})
    await user.deleteOne()
    return {message: "User deleted successfully"};
  }
}
