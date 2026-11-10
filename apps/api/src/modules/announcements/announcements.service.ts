import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AnnouncementsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query?: { category?: string; search?: string }) {
    const where: any = {};
    if (query?.category && query.category !== 'ALL') {
      where.category = query.category;
    }
    if (query?.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { content: { contains: query.search, mode: 'insensitive' } },
        { authorName: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const announcements = await this.prisma.announcement.findMany({
      where,
      orderBy: [{ isPinned: 'desc' }, { publishedAt: 'desc' }],
    });

    return announcements;
  }

  async create(data: { title: string; content: string; category: string; isPinned?: boolean; authorName: string }) {
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);

    return this.prisma.announcement.create({
      data: {
        title: data.title,
        slug,
        content: data.content,
        category: data.category,
        isPinned: data.isPinned || false,
        authorName: data.authorName,
      },
    });
  }
}
