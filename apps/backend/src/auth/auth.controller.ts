import { Body, Controller, Get, Post, Request, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './gaurds/local-auth/local-auth.guard';
import { JwtAuthGuard } from './gaurds/jwt-auth/jwt-auth.guard';
import { RefreshAuthGuard } from './gaurds/refresh-auth/refresh-auth.guard';
import { type Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async login(@Request() req, @Res({passthrough: true}) res: Response) {
    const user = req.user;
    const clientType = req.headers['x-client-type'];
    const tokens = await this.authService.login(req.user.id, req.user.name);

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

  @UseGuards(JwtAuthGuard)
  @Post('signout')
  logout(@Request() req) {
    this.authService.logout(req.user.id)
  }

  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  async refresh(@Request() req, @Res({passthrough: true}) res) {
    
    const clientType = req.headers['x-client-type'];
    const tokens = await this.authService.refreshTokens(req.user.id, req.user.name);

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

  @UseGuards(JwtAuthGuard)
  @Get('protected')
  protectedRoute(@Request() req) {
    return `This is a protected route accessed by ${req.user.id}`
  }
}
