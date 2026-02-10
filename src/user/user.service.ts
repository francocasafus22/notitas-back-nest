import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import {hash} from "bcrypt"

@Injectable()
export class UserService {

  constructor(
    @InjectModel(User.name) private userModel: Model<User>
  ){}

  async create(createUserDto: CreateUserDto): Promise<{message: string}> {
    const newUser = new this.userModel(createUserDto)
    newUser.password = await hash(createUserDto.password, 10)
    await newUser.save()
    return {message: "User created successfully"} 
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec()
  }

  async findOneByUsername(username: string): Promise<User> {
    const userExist = await this.userModel.findOne({username})
    if(!userExist) throw new NotFoundException("User not found")
    return userExist
  }

  async findOne(id: string){
    const userExist = await this.userModel.findById(id).select("-password").exec()
    if(!userExist) throw new NotFoundException("User not found")
    return userExist
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: string){
    const user = await this.findOne(id)
    await user.deleteOne()
    return {message: "User deleted successfully"};
  }
}
