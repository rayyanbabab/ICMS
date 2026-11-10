import { Injectable, UnauthorizedException, BadRequestException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { PrismaService } from '../../database/prisma.service';
import { LoginDto } from './dto/login.dto';
import { UserRole, AuthUserTokenPayload } from '@icms/shared';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto, ipAddress?: string, userAgent?: string) {
    const { identifier, password } = loginDto;

    // Search by email OR username
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier.toLowerCase() },
          { username: identifier.toLowerCase() },
        ],
      },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
        studentProfile: true,
        lecturerProfile: true,
      },
    });

    if (!user) {
      await this.recordLoginLog(null, 'FAILED', 'Pengguna tidak ditemukan', ipAddress, userAgent);
      throw new UnauthorizedException('Kredensial tidak valid');
    }

    if (!user.isActive) {
      await this.recordLoginLog(user.id, 'FAILED', 'Akun dinonaktifkan', ipAddress, userAgent);
      throw new UnauthorizedException('Akun Anda dinonaktifkan. Hubungi administrator.');
    }

    const isPasswordValid = await argon2.verify(user.passwordHash, password);
    if (!isPasswordValid) {
      await this.recordLoginLog(user.id, 'FAILED', 'Password salah', ipAddress, userAgent);
      throw new UnauthorizedException('Kredensial tidak valid');
    }

    const roles = user.userRoles.map((ur) => ur.role.code as UserRole);

    const payload: AuthUserTokenPayload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      roles,
      studentId: user.studentProfile?.id,
      lecturerId: user.lecturerProfile?.id,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(
      { sub: user.id, type: 'refresh' },
      {
        secret: this.configService.get<string>('jwt.refreshSecret'),
        expiresIn: (this.configService.get<string>('jwt.refreshExpiresIn') || '7d') as any,
      },
    );

    // Save session & update last login
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.prisma.$transaction([
      this.prisma.userSession.create({
        data: {
          userId: user.id,
          refreshToken,
          ipAddress,
          userAgent,
          expiresAt,
        },
      }),
      this.prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      }),
    ]);

    await this.recordLoginLog(user.id, 'SUCCESS', 'Login berhasil', ipAddress, userAgent);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        roles,
        avatarUrl: user.avatarUrl,
        studentId: user.studentProfile?.id,
        lecturerId: user.lecturerProfile?.id,
      },
    };
  }

  async refresh(refreshToken: string) {
    try {
      const decoded = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
      });

      const session = await this.prisma.userSession.findUnique({
        where: { refreshToken },
        include: {
          user: {
            include: {
              userRoles: {
                include: { role: true },
              },
              studentProfile: true,
              lecturerProfile: true,
            },
          },
        },
      });

      if (!session || session.isRevoked || session.expiresAt < new Date()) {
        throw new UnauthorizedException('Refresh token tidak valid atau telah kedaluwarsa');
      }

      const user = session.user;
      const roles = user.userRoles.map((ur) => ur.role.code as UserRole);

      const payload: AuthUserTokenPayload = {
        sub: user.id,
        email: user.email,
        username: user.username,
        roles,
        studentId: user.studentProfile?.id,
        lecturerId: user.lecturerProfile?.id,
      };

      const newAccessToken = this.jwtService.sign(payload);

      return {
        accessToken: newAccessToken,
      };
    } catch {
      throw new UnauthorizedException('Refresh token tidak valid');
    }
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
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
        userRoles: {
          include: {
            role: true,
          },
        },
        studentProfile: {
          select: {
            id: true,
            nim: true,
            currentSemester: true,
            gpa: true,
            totalCredits: true,
            status: true,
            studyProgram: {
              select: {
                name: true,
                faculty: { select: { name: true } },
              },
            },
          },
        },
        lecturerProfile: {
          select: {
            id: true,
            nidn: true,
            academicRank: true,
            specialization: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Pengguna tidak ditemukan');
    }

    const roles = user.userRoles.map((ur) => ur.role.code as UserRole);

    return {
      ...user,
      roles,
    };
  }

  private async recordLoginLog(
    userId: string | null,
    status: 'SUCCESS' | 'FAILED',
    reason: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    try {
      await this.prisma.loginLog.create({
        data: {
          userId,
          status,
          reason,
          ipAddress,
          userAgent,
        },
      });
    } catch (err) {
      this.logger.error('Failed to write login log:', err);
    }
  }
}
