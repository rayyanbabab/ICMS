import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as argon2 from 'argon2';
import { UserRole } from '@icms/shared';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(search?: string, role?: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { username: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (role) {
      where.userRoles = {
        some: {
          role: { code: role },
        },
      };
    }

    const [total, users] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          username: true,
          fullName: true,
          phoneNumber: true,
          avatarUrl: true,
          isActive: true,
          isVerified: true,
          lastLoginAt: true,
          createdAt: true,
          userRoles: {
            include: {
              role: true,
            },
          },
        },
      }),
    ]);

    return {
      items: users.map((u) => ({
        ...u,
        roles: u.userRoles.map((ur) => ur.role.code as UserRole),
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async create(dto: CreateUserDto) {
    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: dto.email.toLowerCase() },
          { username: dto.username.toLowerCase() },
        ],
      },
    });

    if (existing) {
      throw new BadRequestException('Email atau username sudah terdaftar');
    }

    const passwordHash = await argon2.hash(dto.password);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        username: dto.username.toLowerCase(),
        fullName: dto.fullName,
        phoneNumber: dto.phoneNumber,
        passwordHash,
        isActive: true,
        isVerified: true,
      },
    });

    // Assign roles
    for (const roleCode of dto.roles) {
      const role = await this.prisma.role.findUnique({
        where: { code: roleCode },
      });

      if (role) {
        await this.prisma.userRoleMap.create({
          data: {
            userId: user.id,
            roleId: role.id,
          },
        });
      }
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      fullName: user.fullName,
      roles: dto.roles,
    };
  }

  async toggleStatus(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('Pengguna tidak ditemukan');
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: { isActive: !user.isActive },
    });

    return {
      id: updated.id,
      isActive: updated.isActive,
    };
  }
}

