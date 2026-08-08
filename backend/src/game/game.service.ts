import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface VerifyAnswerDto {
  teamAId: string;
  teamBId: string;
  playerInput: string;
}

export interface TicTacToeGridConfig {
  rowTeams: Array<{ id: string; name: string; logo?: string }>;
  colTeams: Array<{ id: string; name: string; logo?: string }>;
}

@Injectable()
export class GameService {
  private readonly logger = new Logger(GameService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generate 3x3 Football Tic-Tac-Toe Grid with Valid Pairs (GUARANTEED common player for all 9 cells)
   */
  async generateTicTacToeGrid(): Promise<TicTacToeGridConfig> {
    const teams = await this.prisma.team.findMany({
      where: { logo: { not: null } },
      include: {
        careers: {
          select: { playerId: true },
        },
      },
      take: 120,
    });

    const teamPlayerSets = new Map<string, Set<string>>();
    const validTeams = teams.filter((t) => t.careers.length >= 3);

    for (const t of validTeams) {
      teamPlayerSets.set(t.id, new Set(t.careers.map((c) => c.playerId)));
    }

    // Helper function to check if cell (teamA, teamB) has common players
    const hasCommonPlayer = (teamAId: string, teamBId: string) => {
      const setA = teamPlayerSets.get(teamAId);
      const setB = teamPlayerSets.get(teamBId);
      if (!setA || !setB) return false;
      for (const pid of setA) {
        if (setB.has(pid)) return true;
      }
      return false;
    };

    // Try random combinations of 3 Row Teams & 3 Col Teams where ALL 9 cells are valid
    const shuffledTeams = [...validTeams].sort(() => 0.5 - Math.random());

    for (let attempt = 0; attempt < 5000; attempt++) {
      const candidates = [...shuffledTeams].sort(() => 0.5 - Math.random());
      if (candidates.length < 6) break;

      const rowCandidate = candidates.slice(0, 3);
      const colCandidate = candidates.slice(3, 6);

      let allValid = true;
      for (const r of rowCandidate) {
        for (const c of colCandidate) {
          if (!hasCommonPlayer(r.id, c.id)) {
            allValid = false;
            break;
          }
        }
        if (!allValid) break;
      }

      if (allValid) {
        this.logger.log(
          `✅ 3x3 TIC-TAC-TOE GRID GENERATED with 100% valid 9-cell intersections: [${rowCandidate
            .map((r) => r.name)
            .join(', ')}] vs [${colCandidate.map((c) => c.name).join(', ')}]`,
        );

        return {
          rowTeams: rowCandidate.map((t) => ({ id: t.id, name: t.name, logo: t.logo || undefined })),
          colTeams: colCandidate.map((t) => ({ id: t.id, name: t.name, logo: t.logo || undefined })),
        };
      }
    }

    // Fallback: Systematic Search for valid 3x3 combination
    for (let r = 0; r < validTeams.length - 2; r++) {
      const r1 = validTeams[r];
      for (let r2 = r + 1; r2 < validTeams.length - 1; r2++) {
        const r2Team = validTeams[r2];
        for (let r3 = r2 + 1; r3 < validTeams.length; r3++) {
          const r3Team = validTeams[r3];

          const validCols = validTeams.filter(
            (c) =>
              c.id !== r1.id &&
              c.id !== r2Team.id &&
              c.id !== r3Team.id &&
              hasCommonPlayer(r1.id, c.id) &&
              hasCommonPlayer(r2Team.id, c.id) &&
              hasCommonPlayer(r3Team.id, c.id),
          );

          if (validCols.length >= 3) {
            const shuffledCols = [...validCols].sort(() => 0.5 - Math.random());
            const selectedCols = shuffledCols.slice(0, 3);
            const selectedRows = [r1, r2Team, r3Team];

            return {
              rowTeams: selectedRows.map((t) => ({ id: t.id, name: t.name, logo: t.logo || undefined })),
              colTeams: selectedCols.map((t) => ({ id: t.id, name: t.name, logo: t.logo || undefined })),
            };
          }
        }
      }
    }

    // Default fallback
    const shuffled = [...validTeams].sort(() => 0.5 - Math.random());
    return {
      rowTeams: shuffled.slice(0, 3).map((t) => ({ id: t.id, name: t.name, logo: t.logo || undefined })),
      colTeams: shuffled.slice(3, 6).map((t) => ({ id: t.id, name: t.name, logo: t.logo || undefined })),
    };
  }

  async explorePlayers(query?: string) {
    const clean = query ? query.trim() : '';

    return this.prisma.player.findMany({
      where: clean
        ? {
            OR: [
              { name: { contains: clean, mode: 'insensitive' } },
              { normalizedName: { contains: clean, mode: 'insensitive' } },
              { careers: { some: { team: { name: { contains: clean, mode: 'insensitive' } } } } },
            ],
          }
        : undefined,
      take: 30,
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        photo: true,
        nationality: true,
        careers: {
          select: {
            startYear: true,
            endYear: true,
            isLoan: true,
            team: {
              select: {
                id: true,
                name: true,
                logo: true,
              },
            },
          },
        },
      },
    });
  }

  async searchTeams(query: string) {
    if (!query || query.trim().length === 0) {
      return this.prisma.team.findMany({
        take: 15,
        orderBy: { name: 'asc' },
        select: { id: true, name: true, logo: true, code: true },
      });
    }

    const clean = query.trim();
    return this.prisma.team.findMany({
      where: {
        OR: [
          { name: { contains: clean, mode: 'insensitive' } },
          { code: { contains: clean, mode: 'insensitive' } },
        ],
      },
      take: 20,
      orderBy: { name: 'asc' },
      select: { id: true, name: true, logo: true, code: true },
    });
  }

  async findTeamById(teamId: string) {
    return this.prisma.team.findUnique({
      where: { id: teamId },
      select: { id: true, name: true, logo: true, code: true },
    });
  }

  async getCustomTeamPair(teamAId?: string, teamBId?: string) {
    let teamA = teamAId ? await this.prisma.team.findUnique({ where: { id: teamAId } }) : null;
    let teamB = teamBId ? await this.prisma.team.findUnique({ where: { id: teamBId } }) : null;

    // 1. If BOTH players explicitly selected teams (and they are different):
    if (teamA && teamB && teamA.id !== teamB.id) {
      const commonPlayers = await this.prisma.player.findMany({
        where: {
          careers: { some: { teamId: teamA.id } },
          AND: { careers: { some: { teamId: teamB.id } } },
        },
      });

      this.logger.log(`✅ BOTH TEAMS PRESERVED EXACTLY: ${teamA.name} vs ${teamB.name} (${commonPlayers.length} common players)`);

      return {
        teamA: { id: teamA.id, name: teamA.name, logo: teamA.logo },
        teamB: { id: teamB.id, name: teamB.name, logo: teamB.logo },
        commonPlayerCount: commonPlayers.length,
      };
    }

    // 2. If ONLY teamA was selected by Player 1:
    if (teamA && !teamB) {
      const partnerTeams = await this.prisma.team.findMany({
        where: {
          id: { not: teamA.id },
          careers: {
            some: {
              player: {
                careers: { some: { teamId: teamA.id } },
              },
            },
          },
        },
        take: 50,
      });

      const randomPartner = partnerTeams.length > 0
        ? partnerTeams[Math.floor(Math.random() * partnerTeams.length)]
        : null;

      if (randomPartner) {
        return {
          teamA: { id: teamA.id, name: teamA.name, logo: teamA.logo },
          teamB: { id: randomPartner.id, name: randomPartner.name, logo: randomPartner.logo },
          commonPlayerCount: 1,
        };
      }
    }

    // 3. If ONLY teamB was selected by Player 2:
    if (teamB && !teamA) {
      const partnerTeams = await this.prisma.team.findMany({
        where: {
          id: { not: teamB.id },
          careers: {
            some: {
              player: {
                careers: { some: { teamId: teamB.id } },
              },
            },
          },
        },
        take: 50,
      });

      const randomPartner = partnerTeams.length > 0
        ? partnerTeams[Math.floor(Math.random() * partnerTeams.length)]
        : null;

      if (randomPartner) {
        return {
          teamA: { id: randomPartner.id, name: randomPartner.name, logo: randomPartner.logo },
          teamB: { id: teamB.id, name: teamB.name, logo: teamB.logo },
          commonPlayerCount: 1,
        };
      }
    }

    // 4. Default: fallback to random valid team pair
    return this.getRandomTeamPair();
  }

  async getRandomTeamPair() {
    const teams = await this.prisma.team.findMany({
      include: {
        careers: {
          select: { playerId: true },
        },
      },
      take: 100,
    });

    if (teams.length < 2) {
      throw new NotFoundException('Veritabanında yeterli takım yok.');
    }

    const validPairs: Array<{ teamA: any; teamB: any; commonPlayerCount: number }> = [];

    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        const teamA = teams[i];
        const teamB = teams[j];

        const setA = new Set(teamA.careers.map((c) => c.playerId));
        const setB = new Set(teamB.careers.map((c) => c.playerId));

        let commonCount = 0;
        for (const pid of setA) {
          if (setB.has(pid)) commonCount++;
        }

        if (commonCount > 0) {
          validPairs.push({ teamA, teamB, commonPlayerCount: commonCount });
        }
      }
    }

    if (validPairs.length === 0) {
      throw new NotFoundException('Ortak oyuncusu olan takım ikilisi bulunamadı.');
    }

    const randomIndex = Math.floor(Math.random() * validPairs.length);
    const selected = validPairs[randomIndex];

    return {
      teamA: {
        id: selected.teamA.id,
        name: selected.teamA.name,
        logo: selected.teamA.logo,
      },
      teamB: {
        id: selected.teamB.id,
        name: selected.teamB.name,
        logo: selected.teamB.logo,
      },
      commonPlayerCount: selected.commonPlayerCount,
    };
  }

  async verifyAnswer(dto: VerifyAnswerDto) {
    const cleanInput = dto.playerInput
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    const commonPlayers = await this.prisma.player.findMany({
      where: {
        careers: {
          some: { teamId: dto.teamAId },
        },
        AND: {
          careers: {
            some: { teamId: dto.teamBId },
          },
        },
      },
    });

    let matchedPlayer: any = null;

    for (const player of commonPlayers) {
      const pName = player.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const pNorm = player.normalizedName.toLowerCase();
      const pAliases = (player.aliases || []).map((a) => a.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''));

      if (
        pName === cleanInput ||
        pNorm === cleanInput ||
        pName.includes(cleanInput) ||
        pAliases.some((a) => a.includes(cleanInput))
      ) {
        matchedPlayer = player;
        break;
      }
    }

    if (matchedPlayer) {
      return {
        success: true,
        message: `🏆 TEBRİKLER! ${matchedPlayer.name} her iki takımda da oynadı!`,
        points: 10,
        player: {
          id: matchedPlayer.id,
          name: matchedPlayer.name,
          photo: matchedPlayer.photo,
        },
      };
    } else {
      return {
        success: false,
        message: `❌ '${dto.playerInput}' bu iki takımın ortak futbolcusu değil!`,
        points: 0,
      };
    }
  }

  async saveMatchHistory(userId: string, opponentName: string, gameMode: string, userScore: number, opponentScore: number, isWin: boolean) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) return;
      return await this.prisma.matchHistory.create({
        data: {
          userId,
          opponentName,
          gameMode,
          userScore,
          opponentScore,
          isWin,
        },
      });
    } catch (e) {
      this.logger.error('Failed to save match history:', e);
    }
  }

  async getMatchHistory(userId: string) {
    return this.prisma.matchHistory.findMany({
      where: { userId },
      take: 10,
      orderBy: { createdAt: 'desc' },
    });
  }
}
