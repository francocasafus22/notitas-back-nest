import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/schemas/user.schema';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { envs } from 'src/config/envs';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';


@Module({
  imports: [
    UserModule,
    PassportModule.register({
      defaultStrategy: "jwt"
    }),
    JwtModule.registerAsync({
    global: true,
    useFactory: () => ({
      secret: envs.jwt_secret,
      signOptions: { expiresIn: '15m' },
    }),
  }),
    MongooseModule.forFeature([{name: User.name, schema: UserSchema}])
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy,{provide: APP_GUARD, useClass: JwtAuthGuard}, UserService],
  exports: [AuthService]
})
export class AuthModule {}




