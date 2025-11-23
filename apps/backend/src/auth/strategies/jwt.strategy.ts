import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import jwtConfig from '../config/jwt.config';
import type { ConfigType } from '@nestjs/config';
import { Request } from 'express';
import { AuthJwtPayload } from '../types/auth-jwtpayload';
import { AuthService } from '../auth.service';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtConfigration: ConfigType<typeof jwtConfig>,
    private readonly authservice: AuthService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          // 
          if (req.headers?.authorization?.startsWith('Bearer')) {
            
            return req.headers.authorization.split(' ')[1];
          }

          if (req.cookies?.access_token) {
            
            return req.cookies?.access_token;
          }

          return null;
        },
      ]),
      secretOrKey: jwtConfigration.secret as string,
      ignoreExpiration: false,
    });
  }

  validate(payload: AuthJwtPayload) {
    return this.authservice.validateJWTUser(payload.sub, payload.tokenVersion);
  }
}