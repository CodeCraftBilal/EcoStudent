import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './gaurds/local-auth/local-auth.guard';
import { JwtAuthGuard } from './gaurds/jwt-auth/jwt-auth.guard';
import { RefreshAuthGuard } from './gaurds/refresh-auth/refresh-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async login(@Request() req) {
    const user = req.user;
    const tokens = await this.authService.login(req.user.user_id, req.user.username);

    return {...user, tokens };
  }

  @UseGuards(LocalAuthGuard)
  @Post('signout')
  logout(@Request() req) {
    this.authService.logout(req.user.id)
  }

  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  refresh(@Request() req) {
    // return 'ey'
    return this.authService.refreshTokens(req.user.id, req.user.name);
  }

  @UseGuards(JwtAuthGuard)
  @Get('protected')
  protectedRoute(@Request() req) {
    return `This is a protected route accessed by ${req.user.id}`
  }
}
