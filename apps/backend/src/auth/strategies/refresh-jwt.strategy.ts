import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthJwtPayload } from '../types/auth-jwtpayload';
import type { ConfigType } from '@nestjs/config';
import { AuthService } from '../auth.service';
import refreshConfig from '../config/refresh.config';
import { Request } from 'express';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh-jwt') {
  constructor(
    @Inject(refreshConfig.KEY) private refreshConfigration: ConfigType<typeof refreshConfig>,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refresh'),
      secretOrKey: refreshConfigration.secret!,
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: AuthJwtPayload) {
    console.log('refresh Straitegy is running')
    const userId = payload.sub;
    console.log("userId: ", userId)
    const refreshToken = await req.body.refresh;
    console.log('refreshToken: ', refreshToken)
    // const refreshToken = req.headers.authorization;
    return await this.authService.validateRefreshToken(userId, refreshToken);
  }
}
