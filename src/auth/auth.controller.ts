import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from '../user/dto/change-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GetUserFromSession } from './decorators/get-session.decorator';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(
    @Body() createUserDto: CreateUserDto,
    @Req() req,
  ): Promise<string> {
    const result = await this.authService.register(createUserDto);
    return 'success';
  }

  @Post('/login')
  async login(@Body() loginDto: LoginDto, @Req() req): Promise<string> {
    const result = await this.authService.login(loginDto);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/change-password') //session: string;
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @GetUserFromSession() user,
    @Req() req,
  ): Promise<string> {
    await this.authService.changePassword(changePasswordDto, user);
    return 'success';
  }
}
