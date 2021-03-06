import { Controller, Post, Body, UseGuards, Get, Request, Param, Logger } from '@nestjs/common';
import { Users } from '../users/users.entity';
import { AuthService } from './auth.service';
import { AuthInput } from './auth.input';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {

    constructor(private  readonly  authService:  AuthService) {}

    @Get('login')
    async login(@Request() request: Request): Promise<any> {
      const authorization = (<string>request.headers['authorization']);
      let decodeData = new Buffer(authorization.replace("Basic ", ""), 'base64').toString('utf8')
      let data = decodeData.split(':');
      let user: AuthInput = {
        email: data[0],
        password: data[1]
      }
      return this.authService.login(user);
    } 

    @Post('register')
    async register(@Body() user: Users): Promise<any> {
      return this.authService.register(user);
    }  

    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    async me(@Request() request: Request): Promise<any> {
      const authorization = (<string>request.headers['authorization']);
      const token = authorization.split(' ')[1]
        return this.authService.user(token);
    } 

}
