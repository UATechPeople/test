import { Type } from 'class-transformer';
import { User } from '../../user/user.schema';

export class CreateSessionDto {
  @Type(() => User)
  user: User;
}
