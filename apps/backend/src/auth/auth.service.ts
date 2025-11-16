import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { verify } from 'argon2';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { AuthJwtPayload } from './types/auth-jwtpayload';
import jwtConfig from './config/jwt.config';
import refreshConfig from './config/refresh.config';
import type { ConfigType } from '@nestjs/config';
import { AwardIcon } from 'lucide-react';

@Injectable()
export class AuthService {
  
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtservice: JwtService,
    @Inject(refreshConfig.KEY)
    private refreshConfigration: ConfigType<typeof refreshConfig>,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user || !user.hashed_password) throw new UnauthorizedException();

    const isPasswordMatched = await verify(user.hashed_password, password);

    if (isPasswordMatched) {
      console.log(user.user_id, user.user_name);
      return {
        id: user.user_id,
        name: user.user_name,
        role: user.role,
        email: user.email
      }
    }
    throw new UnauthorizedException();
  }

  async login(userId: number, username: string) {
    return await this.generateTokens(userId, username);
  }

  async generateTokens(userId: number, username: string) {
    console.log('userid: ', userId, 'username: ', username)
    const payload: AuthJwtPayload = { username: username, sub: userId };
    const [access_token, refresh_token] = await Promise.all([
      this.jwtservice.signAsync(payload),
      this.jwtservice.signAsync(payload, this.refreshConfigration),
    ]);

    return {
      access_token,
      refresh_token,
    };
  }

//   validating refresh Token
  async validateRefreshToken(userId: number, refreshToken: any) {
      const user = await this.usersService.findOne(userId);
      if(!user || !user.hashed_refresh_token) throw new UnauthorizedException('Invalide Credentials');

      const refreshTokenMatched = await verify(user.hashed_refresh_token, refreshToken);
      if(!refreshTokenMatched) throw new UnauthorizedException('Invalid Credentials')
      const currentUser = {id: user.user_id}
      return currentUser; 
  }
  
    //   validating jwt user
  async validateJWTUser(sub: number) {
    const user = await this.usersService.findOne(sub);
    if(!user) throw new UnauthorizedException('Invalide Tokens');
    
    const currentuser = {id: user.user_id}
    return currentuser;
  }

  // refresh tokens
  async refreshTokens(id: number, name: string) {
    const {access_token, refresh_token} = await this.generateTokens(id, name)
    return {
      id,
      name,
      access_token,
      refresh_token
    }
  }

  logout(id: any) {
    throw new Error('Method not implemented.');
  }
}
