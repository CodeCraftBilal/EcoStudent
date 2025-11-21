import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash } from 'argon2';

@Injectable()
export class UsersService {
  
  constructor(private readonly prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    
    const isUserExits = await this.prisma.users.findUnique({
      where: {
        email: createUserDto.email,
      }
    })

    if(isUserExits) throw new ConflictException('user already exits!')

    const { password, ...user } = createUserDto;
    const hashedPassword = await hash(password);
    
    return await this.prisma.users.create({
      data: {
        hashedPassword,
        ...user,
        role: 'USER'
      },
    });;
  }

  findAll() {
    const user = this.prisma.users.findMany({
      select: {
        userId: true,
        userName: true,
        email: true,
        role: true,
        profilePicture: true,
        isVerified: true,
        userLocation: true
      }
    });
    return user;
  }

  findOne(id: number) {
    return this.prisma.users.findUnique({
      where: {userId: id},
    })
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number) {
    const user = await this.prisma.users.delete({
      where: {userId: id}
    })

    return {
      id: user.userId,
      name: user.userName,
      email: user.email,
      profile: user.profilePicture,
      role: user.role
    }
  }

  async findByEmail(email: string) {
    return await this.prisma.users.findUnique({
      where: {
        email,
      }
    })
  }

  async updateRefreshToken(hashedRefreshToken: string | null, userId: number, tokenVersion: number) {
    await this.prisma.users.update({
      where: {
        userId,
      },
      data: {hashedRefreshToken, tokenversion: tokenVersion}
    }) 
  }
}
