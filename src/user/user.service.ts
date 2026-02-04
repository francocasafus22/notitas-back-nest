import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {

  constructor(
    @InjectModel(User.name) private userModel: Model<User>
  ){}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = new this.userModel(createUserDto)
    return newUser.save()
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec()
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
