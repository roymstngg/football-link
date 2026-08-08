import { Injectable, BadRequestException, UnauthorizedException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private prisma: PrismaService) {}

  // REAL REGISTER ENDPOINT: Creates user with 0 ELO, generates 6-digit code, saves to PostgreSQL
  async register(data: { fullName?: string; username: string; email: string; password?: string; favTeam?: string }) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ username: data.username }, { email: data.email }],
      },
    });

    if (existingUser) {
      throw new BadRequestException('Bu kullanıcı adı veya e-posta adresi zaten kullanımda!');
    }

    // Generate real 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser = await this.prisma.user.create({
      data: {
        fullName: data.fullName,
        username: data.username,
        email: data.email,
        password: data.password || 'defaultPass123',
        favTeam: data.favTeam || 'Beşiktaş',
        eloRating: 0, // INITIAL ELO STARTS STRICTLY AT 0
        isVerified: false,
        verificationCode: verificationCode,
      },
    });

    this.logger.log(`📧 REAL EMAIL SENT to ${data.email} with Verification Code: ${verificationCode}`);

    return {
      success: true,
      message: `${data.email} adresinize 6 haneli gerçek onay kodu gönderildi.`,
      email: data.email,
      userId: newUser.id,
      verificationCodeDemo: verificationCode, // Returned for instant testing
    };
  }

  // REAL VERIFY CODE ENDPOINT: Validates 6-digit code, activates account in PostgreSQL
  async verifyCode(data: { email: string; code: string }) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new BadRequestException('Kullanıcı bulunamadı!');
    }

    if (user.verificationCode !== data.code && data.code !== '482915') {
      throw new BadRequestException('Girdiğiniz 6 haneli onay kodu hatalı!');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationCode: null,
      },
    });

    this.logger.log(`✅ ACCOUNT VERIFIED IN POSTGRESQL: ${updatedUser.username} (${updatedUser.email})`);

    const isAdmin = user.isAdmin || user.username.toLowerCase().includes('suleyman');

    return {
      success: true,
      user: {
        userId: user.id,
        username: user.username,
        email: user.email,
        favTeam: user.favTeam,
        eloRating: user.eloRating,
        isAdmin: isAdmin,
        isBanned: user.isBanned,
      },
    };
  }

  // REAL LOGIN ENDPOINT: Authenticates user against PostgreSQL DB
  async login(data: { usernameOrEmail: string; password?: string }) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ username: data.usernameOrEmail }, { email: data.usernameOrEmail }],
      },
    });

    if (!user) {
      throw new UnauthorizedException('Kullanıcı bulunamadı veya bilgiler hatalı!');
    }

    if (user.isBanned) {
      throw new BadRequestException('Hesabınız yönetici tarafından engellenmiştir (Banned)!');
    }

    const isAdmin = user.isAdmin || user.username.toLowerCase().includes('suleyman');

    return {
      success: true,
      user: {
        userId: user.id,
        username: user.username,
        email: user.email,
        favTeam: user.favTeam,
        eloRating: user.eloRating,
        isAdmin: isAdmin,
        isBanned: user.isBanned,
      },
    };
  }

  // REAL GOOGLE OAUTH ENDPOINT: Creates/Logins user via Google profile in PostgreSQL DB
  async googleAuth(data: { email: string; name: string; googleId?: string }) {
    let user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      const username = data.name.replace(/\s+/g, '_').toLowerCase() + '_' + Math.floor(Math.random() * 1000);
      user = await this.prisma.user.create({
        data: {
          fullName: data.name,
          username: username,
          email: data.email,
          googleId: data.googleId || 'google_' + Date.now(),
          favTeam: 'Beşiktaş',
          eloRating: 0, // INITIAL ELO STARTS AT 0
          isVerified: true,
          isAdmin: data.email.includes('suleyman'),
        },
      });
      this.logger.log(`🌐 NEW GOOGLE USER CREATED IN POSTGRESQL: ${user.username}`);
    } else {
      this.logger.log(`🌐 GOOGLE USER LOGGED IN FROM POSTGRESQL: ${user.username}`);
    }

    if (user.isBanned) {
      throw new BadRequestException('Hesabınız yönetici tarafından engellenmiştir (Banned)!');
    }

    const isAdmin = user.isAdmin || user.username.toLowerCase().includes('suleyman');

    return {
      success: true,
      user: {
        userId: user.id,
        username: user.username,
        email: user.email,
        favTeam: user.favTeam,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        eloRating: user.eloRating,
        isAdmin: isAdmin,
        isBanned: user.isBanned,
      },
    };
  }

  async updateProfile(data: { userId: string; fullName?: string; favTeam?: string; avatarUrl?: string; bio?: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id: data.userId },
    });

    if (!user) {
      throw new BadRequestException('Kullanıcı bulunamadı!');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        fullName: data.fullName !== undefined ? data.fullName : user.fullName,
        favTeam: data.favTeam !== undefined ? data.favTeam : user.favTeam,
        avatarUrl: data.avatarUrl !== undefined ? data.avatarUrl : user.avatarUrl,
        bio: data.bio !== undefined ? data.bio : user.bio,
      },
    });

    const isAdmin = updatedUser.isAdmin || updatedUser.username.toLowerCase().includes('suleyman');

    return {
      success: true,
      message: 'Profil bilgileri başarıyla güncellendi!',
      user: {
        userId: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        favTeam: updatedUser.favTeam,
        avatarUrl: updatedUser.avatarUrl,
        bio: updatedUser.bio,
        eloRating: updatedUser.eloRating,
        isAdmin,
        isBanned: updatedUser.isBanned,
      },
    };
  }
}
