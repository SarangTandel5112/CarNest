import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Patch, Post, Query, Session, UseGuards, UseInterceptors, Res } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { Serialize } from 'src/interceptors/serialize.interceptors';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { AuthGuard } from 'src/guards/auth.guard';
import { JwtModule, JwtService } from '@nestjs/jwt';
// import { Response, Res } from '@nestjs/common';
// import { response } from 'express';
import { Response } from 'express'
import { CurrentUserJwt } from './decorators/currrent-userjwt.decorator';
import { JwtAuthGuard } from 'src/guards/jwtauth.guard';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {

    constructor(private usersService: UsersService,
        private authService: AuthService,
        private jwtService: JwtService
    ) { }

    @Get('whoami')
    @UseGuards(AuthGuard)
    whoAmI(@CurrentUser() user: User) {
        // console.log(user);
        return user;
    }

    @Get('getloggedinuser')
    @UseGuards(JwtAuthGuard)
    getUser(@CurrentUserJwt() user: User) {
        console.log(user);
        return user;
    }

    @Get('signout')
    signout(@Session() session: any) {
        session.userId = null;
    }

    @Post('/signup')
    async createUser(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signup(body.email, body.password);
        // session.userId = user.id;
        return user;
    }

    // @Serialize(UserDto)
    @Post('/signin')
    async signin(@Body() body: CreateUserDto, @Session() session: any, @Res({ passthrough: true }) response: Response) {
        const user = await this.authService.signin(body.email, body.password);
        session.userId = user.id;
        const jwt = await this.jwtService.sign({ id: user.id });
        response.cookie('AuthToken', jwt)
        return user;
    }

    // @UseInterceptors(new SerializeInterceptor(UserDto))
    @Serialize(UserDto)
    @Get('/:id')
    findUser(@Param('id') id: string) {
        return this.usersService.findOne(parseInt(id));
    }

    @Get()
    findAllUsers(@Query('email') email: string) {
        return this.usersService.find(email)
    }

    @Delete('/:id')
    removeUser(@Param('id') id: string) {
        return this.usersService.remove(parseInt(id))
    }

    @Patch('/:id')
    updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
        return this.usersService.update(parseInt(id), body)
    }

}
