import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { CurrentUserJwtInterceptor } from './interceptors/current-userjwt.interceptor';

@Module({
  imports: [TypeOrmModule.forFeature([User]),
  JwtModule.register({
    secret: 'secrert',
    signOptions: { expiresIn: '1d' }
  })
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    AuthService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CurrentUserJwtInterceptor
    },

  ]
})
export class UsersModule { }
