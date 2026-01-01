import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
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
      },
    });

    if (isUserExits) throw new ConflictException('user already exits!');

    const { password, ...user } = createUserDto;
    const hashedPassword = await hash(password);

    return await this.prisma.users.create({
      data: {
        hashedPassword,
        ...user,
        role: 'USER',
      },
    });
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
        userLocation: true,
      },
    });
    return user;
  }

  findOne(id: number) {
    return this.prisma.users.findUnique({
      where: { userId: id },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    console.log(`updating user with dto: `, updateUserDto);
    return await this.prisma.users.update({
      where: { userId: id },
      data: { ...updateUserDto },
    });
  }

  async remove(id: number) {
    const user = await this.prisma.users.delete({
      where: { userId: id },
    });

    return {
      id: user.userId,
      name: user.userName,
      email: user.email,
      profile: user.profilePicture,
      role: user.role,
    };
  }

  async findByEmail(email: string) {
    return await this.prisma.users.findUnique({
      where: {
        email,
      },
    });
  }

  async updateRefreshToken(
    hashedRefreshToken: string | null,
    userId: number,
    tokenVersion: number,
  ) {
    await this.prisma.users.update({
      where: {
        userId,
      },
      data: { hashedRefreshToken, tokenversion: tokenVersion },
    });
  }

  async getUserProfile(userId: number) {
    const [
      user,
      totalListings,
      itemsSold,
      itemsBought,
      totalEarnings,
      rating,
      reviewsCount,
    ] = await Promise.all([
      this.prisma.users.findUnique({
        where: {
          userId,
        },
      }),
      this.prisma.product.count({
        where: {
          userId,
          status: 'active',
        },
      }),
      this.prisma.product.count({
        where: {
          userId,
          status: 'sold',
        },
      }),
      this.prisma.exchanges.count({
        where: {
          buyerId: userId,
          status: 'completed',
        },
      }),
      // total earnings
      this.prisma.exchanges.aggregate({
        where: {
          product: {
            userId,
          },
          status: 'completed',
        },
        _sum: {
          agreedPrice: true,
        },
      }),
      // review count
      this.prisma.reviews.count({
        where: {
          revieweduserid: userId,
        },
      }),
      // rattings
      this.prisma.reviews.aggregate({
        where: {
          revieweduserid: userId,
        },
        _avg: {
          rating: true,
        },
      }),
    ]);

    const formatedUser = this.formateUser(user);

    const formatedStats = {
      totalListings: totalListings || 0,
      itemsSold: itemsSold || 0,
      itemsBought: itemsBought || 0,
      totalEarnings: totalEarnings._sum.agreedPrice || 0,
      rating: rating || 0,
      reviewsCount: reviewsCount._avg.rating || 0,
    };

    return {
      user: formatedUser,
      stats: formatedStats,
    };
  }

  async updateUserLocation(body: any, userId: any) {
    const user = await this.update(userId, body)
    return {
      success: true,
      error: false,
      message: `${user.userName} you location is updated successfuly`
    }
  }

  async updateProfilePicture(userId: number, body: UpdateUserDto) {
    const user = await this.update(userId, body);
    return {
      success: true,
      error: false,
      message: `${user.userName} you profile is updated successfuly`
    }
  }

  formateUser(user: any) {
    const formatedUser = {
      id: user?.userId,
      name: user?.userName,
      email: user?.email,
      phone: user?.phoneNumber || '',
      avatar: user?.profilePicture,
      location: user?.userLocation || '',
      latitude: 0,
      longitude: 0,
      userType: 'student',
      coverImage: '',
      joinDate: user?.createdAt || '',
      isVerified: user?.isVerified || false,
      institution: '',
      course: '',
      semester: '',
    };

    return formatedUser;
  }
}
