import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SessionService } from './session.service';
import { Session, SessionSchema } from './session.schema';
import { ConfigModule } from '@nestjs/config';
import { authConfig } from '../../config/auth.config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserModule } from '../user/user.module';
import { UtilsModule } from '../utils/utils.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, SessionService, JwtStrategy],
  imports: [
    UserModule,
    UtilsModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync(authConfig.asProvider()),
    ConfigModule.forFeature(authConfig),
    MongooseModule.forFeature([{ name: Session.name, schema: SessionSchema }]),
  ],
})
export class AuthModule {}
