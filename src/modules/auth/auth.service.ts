import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { SessionService } from './session.service';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from '../user/dto/change-password.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { PasswordService } from '../utils/password.service';
import { Model } from 'mongoose';
import { UserDocument } from '../user/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private sessionService: SessionService,
    private passwordService: PasswordService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<Model<UserDocument>> {
    this.passwordService.checkPasswordQuality(createUserDto.password);

    const bycriptedPassword = await this.passwordService.hashPassword(
      createUserDto.password,
    );

    return await this.userService.createUser({
      password: bycriptedPassword,
      username: createUserDto.username,
    });
  }

  async login(loginDto: LoginDto): Promise<string> {
    const user = await this.userService.getUserByUsername(loginDto.username);
    if (!user) {
      throw new BadRequestException(" User don't exist");
    }
    const isPasswordMatching = await this.passwordService.comparePassword(
      loginDto.password,
      user.password,
    );
    if (!isPasswordMatching) {
      throw new BadRequestException('Wrong credentials provided');
    }
    const session = await this.sessionService.createSession({ user: user });

    const access_token = await this.issueToken(session);
    return access_token;
  }

  async changePassword(
    changePasswordDto: ChangePasswordDto,
    user,
  ): Promise<boolean> {
    this.passwordService.checkPasswordQuality(changePasswordDto.newPassword);
    await this.userService.updatePassword(changePasswordDto, user);
    await this.sessionService.deleteSessionsByUser(user);
    return true;
  }

  async issueToken(session): Promise<string> {
    return this.jwtService.sign({
      sessionID: session.sessionID,
    });
  }
}
