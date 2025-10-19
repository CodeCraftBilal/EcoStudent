import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AwardIcon } from 'lucide-react';
import { hash } from 'argon2';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    
    const { password, ...user } = createUserDto;
    const hashed_password = await hash(password);
    
    return await this.prisma.users.create({
      data: {
        hashed_password,
        ...user,
      },
    });
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return this.prisma.users.findUnique({
      where: {user_id: id}
    })
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number) {
    const user = await this.prisma.users.delete({
      where: {user_id: id}
    })

    return `user deleted with user name ${user.user_id}`
  }

  async findByEmail(email: string) {
    return await this.prisma.users.findUnique({
      where: {
        email,
      }
    })
  }
}
