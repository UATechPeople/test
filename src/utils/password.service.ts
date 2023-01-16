import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { bcryptConfig } from '../config/bcrypt.config';
import { ConfigType } from '@nestjs/config';
import * as zxcvbn from 'zxcvbn-typescript';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  constructor(
    @Inject(bcryptConfig.KEY)
    private configBcrypt: ConfigType<typeof bcryptConfig>,
  ) {}

  checkPasswordQuality(password: string): boolean {
    const quality = zxcvbn.zxcvbn(password).score < 3;
    if (quality) {
      throw new BadRequestException('Weak password');
    }
    return true;
  }

  hashPassword(password: string): any {
    return bcrypt.hash(password, this.configBcrypt.saltRounds);
  }

  comparePassword(firstPassword, secondPassword): any {
    return bcrypt.compare(firstPassword, secondPassword);
  }
}
