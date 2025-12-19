import { Body, Controller, Get, Post, Req, Request, Res, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './gaurds/local-auth/local-auth.guard';
import { RefreshAuthGuard } from './gaurds/refresh-auth/refresh-auth.guard';
import { type Response } from 'express';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { GoogleAuthGuard } from './gaurds/google-auth/google-auth.guard';
import { Public } from './decorators/public.decorator';
import { Roles } from './decorators/roles.decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  async registerUser(@Req() req, @Res() res, @Body() createUserDto: CreateUserDto ) {
    console.log('Register User DTO: ', createUserDto);
    const result = await this.authService.registerUser(createUserDto);
    
    if(!result.user) {
      
      return result;
    };
    
    const tokens = await this.authService.login(result.user?.id, result.user?.name, result.user.tokenVersion);
    
    const clientType = req.headers['x-client-type'];
    if(clientType === 'mobile') {
      return { tokens}
    } else {
      
      res.cookie('access_token', tokens.access_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 15,
        path: '/'
      })

      res.cookie('refresh_token', tokens.refresh_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 24 * 7,
        path: '/'
      })
    }
    
    const {user, ...finalResult} = result;
    
    res.json(finalResult);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async login(@Request() req, @Res({passthrough: true}) res: Response) {
    const user = req.user;
    const clientType = req.headers['x-client-type'];
    const tokens = await this.authService.login(req.user.id, req.user.name, req.user.tokenVersion);

    if(clientType === 'mobile') {
      return {...user, tokens}
    } else {
      
      res.cookie('access_token', tokens.access_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 15,
        path: '/'
      })

      res.cookie('refresh_token', tokens.refresh_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 24 * 7,
        path: '/'
      })
      return {...user, message: 'user logged in successfuly' };
    }
  }

  @Public()
  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  async refresh(@Request() req, @Res({passthrough: true}) res) {
    
    const clientType = req.headers['x-client-type'];
    const tokens = await this.authService.refreshTokens(req.user.id, req.user.name, req.user.tokenVerion);

    
    if(clientType === 'mobile') {
      return { tokens }
    } else {
      res.cookie('access_token', tokens.access_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 15,
        path: '/'
      })

      res.cookie('refresh_token', tokens.refresh_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 24 * 7,
        path: '/'
      })
      return { message: 'refreshed successfuly' };
    }
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  googleLogin() {}

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallback(@Request() req, @Res() res: Response) {
    
    const user = req.user;
    const result = await this.authService.login(user.userId, user.userName, user.tokenVersion);

    res.cookie('access_token', result.access_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 15,
        path: '/'
      })

      res.cookie('refresh_token', result.refresh_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 24 * 7,
        path: '/'
      })
      
      res.redirect(`http://localhost:3000/dashboard?userId=${user.userId}&userName=${user.userName}&role=${user.role}$email=${user.email}&profilePic${user.profilePicture}`)
      // return {...user, message: 'user logged in successfuly' };

      // id: user.userId,
      //   name: user.userName,
      //   role: user.role,
      //   email: user.email
    // const response = await this.authService.login(req.user.id, req.user.name, req.user.role);
    // res.redirect(
    //   `http://localhost:3000/api/auth/google/callback?userId=${response.id}&name=${response.name}&accessToken=${response.accessToken}&refreshToken=${response.refreshToken}&role=${response.role}`,
    // );
    // 
  }

  @Get('/session')
  getSession(@Req() req) {
    return this.authService.getsession(req.user.id);
  }

  @Get('signout')
  logout(@Request() req) {
    
    return this.authService.logout(req.user.id, req.user.tokenVersion)
  }

  @Roles('USER', 'ADMIN')
  @Get('protected')
  protectedRoute(@Request() req) {
    return `This is a protected route accessed by ${req.user.id}`
  }
}
