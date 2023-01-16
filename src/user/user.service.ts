import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import { ChangePasswordDto } from './dto/change-password.dto';
import { PasswordService } from '../utils/password.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private passwordService: PasswordService,
  ) {}

  async getUser(session): Promise<UserDocument> {
    const user = await this.userModel.findOne({ _id: session.user });

    return user;
  }

  async getUserByUsername(username): Promise<UserDocument> {
    return this.userModel.findOne({ username: username });
  }

  async createUser(user: User): Promise<any> {
    const newUser = new this.userModel(user);
    return await newUser.save();
  }

  async updatePassword(
    changePasswordDto: ChangePasswordDto,
    user,
  ): Promise<UserDocument> {
    if (!user) {
      throw new BadRequestException('please log in');
    }
    const isPasswordMatching = await this.passwordService.comparePassword(
      changePasswordDto.oldPassword,
      user.password,
    );
    if (!isPasswordMatching) {
      throw new BadRequestException('Wrong credentials provided');
    }

    const bycriptedPassword = await this.passwordService.hashPassword(
      changePasswordDto.newPassword,
    );

    user.password = bycriptedPassword;
    const newUser = await this.createUser(user);

    return await newUser.save();
  }
}
