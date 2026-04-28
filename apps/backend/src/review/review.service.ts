import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReviewService {
  constructor(private readonly prisma: PrismaService) {}
  create(createReviewDto: CreateReviewDto) {
    this.prisma.reviews.create({
      data: {
        ...createReviewDto
      }
    })
  }

  async findAll(pid: number) {
    const reviews = await this.prisma.reviews.findMany({
      where: {
        revieweduserid: pid
      },
      select: {
        reviewid: true,
        rating: true,
        comment: true,
        created_at: true,
        users_reviews_revieweridTousers: {
          select: {
            userName: true,
            profilePicture: true,
            isVerified: true,
          },
        },
      },
    });
    console.log('reviews: ', reviews)
    return reviews.map(r=> ({
      id: r.reviewid,
    user: {
      name: r.users_reviews_revieweridTousers?.userName,
      avatar: r.users_reviews_revieweridTousers?.profilePicture,
      verified: r.users_reviews_revieweridTousers?.isVerified
    },
    rating: r.rating,
    comment: r.comment,
    date: r.created_at,
    helpful: Math.ceil(Math.random() * 10)
    }));
  }

  findOne(id: number) {
    return `This action returns a #${id} review`;
  }

  update(id: number, updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${id} review`;
  }

  remove(id: number) {
    return `This action removes a #${id} review`;
  }
}
