import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { hash, verify } from 'argon2';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { AuthJwtPayload } from './types/auth-jwtpayload';
import refreshConfig from './config/refresh.config';
import type { ConfigType } from '@nestjs/config';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserSession } from './types/userSession';

@Injectable()
export class AuthService {
  
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtservice: JwtService,
    @Inject(refreshConfig.KEY)
    private refreshConfigration: ConfigType<typeof refreshConfig>,
  ) {}
  async registerUser(createUserDto: CreateUserDto) {
    const user = await this.usersService.findByEmail(createUserDto.email);
    if (user) throw new ConflictException('user already exits!');

    try {
      const user = await this.usersService.create(createUserDto);
      return {
        user: {
          id: user.userId,
          name: user.userName,
          tokenVersion: user.tokenversion
        },
        error: false,
        success: true,
        message: 'Sign In successfuly'
      };
    } catch(err) {
      return {
        error: true,
        success: false,
        message: 'Something went wrong!'
      }
    }
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user || !user.hashedPassword) throw new UnauthorizedException();

    const isPasswordMatched = await verify(user.hashedPassword, password);

    if (isPasswordMatched) {
      console.log(user.userId, user.userName);
      return {
        id: user.userId,
        name: user.userName,
        role: user.role,
        email: user.email,
        tokenVersion: user.tokenversion
      };
    }
    throw new UnauthorizedException('Invalid Credential!');
  }

  async login(userId: number, username: string, tokenVersion: number) {
    return await this.generateTokens(userId, username, tokenVersion);
  }

  async generateTokens(userId: number, username: string, tokenVersion: number) {
    console.log('userid: ', userId, 'username: ', username, 'tokenVersion: ', tokenVersion);
    const payload: AuthJwtPayload = { username: username, sub: userId, tokenVersion };
    const [access_token, refresh_token] = await Promise.all([
      this.jwtservice.signAsync(payload),
      this.jwtservice.signAsync(payload, this.refreshConfigration),
    ]);

    const hashedRefreshToken = await hash(refresh_token);

    await this.usersService.updateRefreshToken(hashedRefreshToken, userId, tokenVersion);

    console.log('tokens generated and stored')
    return {
      access_token,
      refresh_token,
    };
  }

  //   validating refresh Token
  async validateRefreshToken(userId: number, refreshToken: string) {
    const user = await this.usersService.findOne(userId);
    if (!user || !user.hashedRefreshToken)
      throw new UnauthorizedException('Invalide Credentials');
    const refreshTokenMatched = await verify(
      user.hashedRefreshToken,
      refreshToken,
    );
    if (!refreshTokenMatched)
      throw new UnauthorizedException('Invalid Credentials');
    const currentUser = { id: user.userId, name: user.userName ,role: user.role, tokenVerion: user.tokenversion };
    return currentUser;
  }

  //   validating jwt user
  async validateJWTUser(sub: number, tokenVersion: number) {
    const user = await this.usersService.findOne(sub);
    if (!user) throw new UnauthorizedException('Invalide Tokens');
    if(user.tokenversion != tokenVersion) throw new UnauthorizedException('!Session Expired');

    const currentuser = { id: user.userId, role: user.role, tokenVersion: user.tokenversion };
    return currentuser;
  }

  // refresh tokens
  async refreshTokens(id: number, name: string, tokenVerion: number) {
    const { access_token, refresh_token } = await this.generateTokens(id, name, tokenVerion);
    return {
      id,
      name,
      access_token,
      refresh_token,
    };
  }

  async validateGoogleUser(googleUser: CreateUserDto) {
    console.log('googleUser: ', googleUser);
    const user = await this.usersService.findByEmail(googleUser.email);
    if (user) return user;
    return await this.usersService.create(googleUser);
  }

  async getsession(id: number): Promise<UserSession | null> {
    const user = await this.usersService.findOne(id);

    if(!user) return null;
    return{
      userId: user.userId.toString(),
      userName: user.userName,
      email: user.email,
      profile: user.profilePicture,
      role: user.role,
    }
  }

  async logout(userId: number, tokenVersion: number) {
    console.log('before logout ', tokenVersion, 'after ')
    tokenVersion = tokenVersion + 1;
    console.log(tokenVersion)
    await this.usersService.updateRefreshToken(null, userId, tokenVersion);
    return {
      error: false,
      success: true,
      message: 'logout successfuly'
    }
  }
}
