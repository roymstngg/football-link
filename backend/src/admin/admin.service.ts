import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getSystemStats() {
    const [totalPlayers, totalTeams, totalCareers, totalUsers, bannedUsers] = await Promise.all([
      this.prisma.player.count(),
      this.prisma.team.count(),
      this.prisma.playerCareer.count(),
      this.prisma.user.count(),
      this.prisma.user.count({ where: { isBanned: true } }),
    ]);

    return {
      totalPlayers,
      totalTeams,
      totalCareers,
      totalUsers,
      bannedUsers,
    };
  }

  async getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        favTeam: true,
        eloRating: true,
        isAdmin: true,
        isBanned: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  async updateUserStatus(dto: { userId: string; eloRating?: number; isBanned?: boolean; isAdmin?: boolean }) {
    return this.prisma.user.update({
      where: { id: dto.userId },
      data: {
        ...(dto.eloRating !== undefined && { eloRating: dto.eloRating }),
        ...(dto.isBanned !== undefined && { isBanned: dto.isBanned }),
        ...(dto.isAdmin !== undefined && { isAdmin: dto.isAdmin }),
      },
    });
  }

  async addPlayer(dto: { name: string; photo?: string; nationality?: string; aliases?: string[]; teamIds?: string[] }) {
    const normalizedName = dto.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    const player = await this.prisma.player.create({
      data: {
        name: dto.name,
        normalizedName,
        photo: dto.photo || 'https://media.api-sports.io/football/players/144.png',
        nationality: dto.nationality || 'Dünya',
        aliases: dto.aliases || [dto.name.toLowerCase()],
      },
    });

    if (dto.teamIds && dto.teamIds.length > 0) {
      for (const teamId of dto.teamIds) {
        await this.prisma.playerCareer.create({
          data: {
            playerId: player.id,
            teamId,
          },
        });
      }
    }

    return player;
  }

  async addCareer(dto: { playerId: string; teamId: string }) {
    return this.prisma.playerCareer.upsert({
      where: {
        playerId_teamId: { playerId: dto.playerId, teamId: dto.teamId },
      },
      update: {},
      create: {
        playerId: dto.playerId,
        teamId: dto.teamId,
      },
    });
  }

  async deletePlayer(playerId: string) {
    return this.prisma.player.delete({
      where: { id: playerId },
    });
  }
}
