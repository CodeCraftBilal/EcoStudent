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
    @Inject(refreshConfig.KEY)
    private refreshConfigration: ConfigType<typeof refreshConfig>,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          if (req.headers?.authorization?.startsWith('Bearer')) {
            return req.headers.authorization.split(' ')[1];
          }
          
          if (req.cookies?.refresh_token) {
            console.log('refresh token: ', req.cookies?.refresh_token);
            return req.cookies?.refresh_token;
          }

          return null;
        },
      ]),
      secretOrKey: refreshConfigration.secret!,
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: AuthJwtPayload) {
    console.log('refresh Straitegy is running');
    const userId = payload.sub;
    let refreshToken;
    if (req.headers['x-client-type']) {
      if (req.headers?.authorization?.startsWith('Bearer')) {
        refreshToken = req.headers.authorization.split(' ')[1];
      }
    } else {
      refreshToken = req.cookies?.refresh_token;
    }
    console.log('refreshToken: ', refreshToken);
    return await this.authService.validateRefreshToken(userId, refreshToken);
  }
}
