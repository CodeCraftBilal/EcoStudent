import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SearchhistoryService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrUpdateSearch(userId: number, query: string) {
    // Check if the query already exists for this user
    const existingSearch = await this.prisma.search_history.findFirst({
      where: {
        userid: userId,
        query: query,
      },
    });

    if (existingSearch) {
      // Update the created_at to current time
      return this.prisma.search_history.update({
        where: { searchid: existingSearch.searchid },
        data: { created_at: new Date() },
      });
    }

    // Create a new record
    return this.prisma.search_history.create({
      data: {
        userid: userId,
        query: query,
        created_at: new Date(),
      },
    });
  }

  async getUserSearchHistory(userId: number) {
    return this.prisma.search_history.findMany({
      where: { userid: userId },
      orderBy: { created_at: 'desc' },
      take: 10,
    });
  }

  async searchHistory(userId: number, keyword: string) {
    // raw query to handle ILIKE and case ranking
    return this.prisma.$queryRaw`
      SELECT * FROM search_history
      WHERE userid = ${userId} AND query ILIKE ${'%' + keyword + '%'}
      ORDER BY 
        CASE 
          WHEN query ILIKE ${keyword} THEN 1
          WHEN query ILIKE ${keyword + '%'} THEN 2
          ELSE 3
        END,
        created_at DESC
      LIMIT 10
    `;
  }

  async deleteSearchHistoryItem(userId: number, searchid: number) {
    const existingSearch = await this.prisma.search_history.findFirst({
      where: {
        searchid,
        userid: userId,
      },
    });

    if (!existingSearch) {
      throw new NotFoundException('Search history item not found or does not belong to user');
    }

    return this.prisma.search_history.delete({
      where: { searchid },
    });
  }

  async clearSearchHistory(userId: number) {
    return this.prisma.search_history.deleteMany({
      where: { userid: userId },
    });
  }
}
