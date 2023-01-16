import { Length } from 'class-validator';

export class ChangePasswordDto {
  @Length(1, 64)
  oldPassword: string;
  @Length(1, 64)
  newPassword;
}
