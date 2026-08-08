import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { PrismaService } from '../prisma/prisma.service';

export interface TransfermarktTransfer {
  season: string;
  date: string;
  movingFrom: string;
  movingFromLogo?: string;
  movingTo: string;
  movingToLogo?: string;
  marketValue?: string;
  fee?: string;
}

export interface TransfermarktPlayerProfile {
  name: string;
  transfermarktId: string;
  nationality?: string;
  transfers: TransfermarktTransfer[];
}

@Injectable()
export class TransfermarktService {
  private readonly logger = new Logger(TransfermarktService.name);
  private readonly baseUrl = 'https://www.transfermarkt.com';
  private readonly headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9,tr;q=0.8',
  };

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Search Player or Team on Transfermarkt
   */
  async searchTransfermarkt(query: string) {
    try {
      const searchUrl = `${this.baseUrl}/schnellsuche/ergebnis/schnellsuche?query=${encodeURIComponent(query)}`;
      this.logger.log(`🔍 Searching Transfermarkt for: "${query}"...`);
      
      const response = await axios.get(searchUrl, { headers: this.headers, timeout: 10000 });
      const $ = cheerio.load(response.data);

      const results: Array<{ id: string; name: string; url: string; type: 'player' | 'club' }> = [];

      // Extract players from search results table
      $('.spielprofil_tooltip').each((_, el) => {
        const name = $(el).text().trim();
        const href = $(el).attr('href') || '';
        const match = href.match(/\/spieler\/(\d+)/);
        if (match && name) {
          results.push({
            id: match[1],
            name,
            url: href,
            type: 'player',
          });
        }
      });

      return results;
    } catch (err) {
      this.logger.error(`Transfermarkt Search Error: ${err.message}`);
      return [];
    }
  }

  /**
   * Fetch complete player transfer history from Transfermarkt page
   */
  async getPlayerTransfersFromTransfermarkt(playerSlugAndId: string): Promise<TransfermarktPlayerProfile | null> {
    try {
      // Form URL: e.g. burak-yilmaz/transfers/spieler/34520
      let pageUrl = playerSlugAndId;
      if (!pageUrl.startsWith('http')) {
        pageUrl = `${this.baseUrl}/${playerSlugAndId.replace('/profil/', '/transfers/')}`;
      }

      this.logger.log(`📥 Fetching Transfermarkt Transfers from: ${pageUrl}`);
      const response = await axios.get(pageUrl, { headers: this.headers, timeout: 12000 });
      const $ = cheerio.load(response.data);

      const playerName = $('h1.data-header__headline-wrapper').text().trim() || $('h1').text().trim();
      const transfers: TransfermarktTransfer[] = [];

      // Parse Transfermarkt transfer history table
      $('.tm-player-transfer-history-grid').each((_, el) => {
        const season = $(el).find('.tm-player-transfer-history-grid__season').text().trim();
        const date = $(el).find('.tm-player-transfer-history-grid__date').text().trim();
        const movingFrom = $(el).find('.tm-player-transfer-history-grid__old-club .tm-player-transfer-history-grid__club-name').text().trim();
        const movingFromLogo = $(el).find('.tm-player-transfer-history-grid__old-club img').attr('src');
        const movingTo = $(el).find('.tm-player-transfer-history-grid__new-club .tm-player-transfer-history-grid__club-name').text().trim();
        const movingToLogo = $(el).find('.tm-player-transfer-history-grid__new-club img').attr('src');
        const fee = $(el).find('.tm-player-transfer-history-grid__fee').text().trim();

        if (movingFrom || movingTo) {
          transfers.push({
            season,
            date,
            movingFrom,
            movingFromLogo,
            movingTo,
            movingToLogo,
            fee,
          });
        }
      });

      return {
        name: playerName,
        transfermarktId: playerSlugAndId,
        transfers,
      };
    } catch (err) {
      this.logger.error(`Failed to fetch Transfermarkt player data: ${err.message}`);
      return null;
    }
  }

  /**
   * Import complete Transfermarkt player career into PostgreSQL
   */
  async importTransfermarktPlayerCareer(playerName: string, teamsList: Array<{ name: string; logo?: string }>) {
    const normalized = playerName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    let player = await this.prisma.player.findFirst({
      where: {
        OR: [
          { normalizedName: normalized },
          { name: { contains: playerName.split(' ')[0], mode: 'insensitive' } },
        ],
      },
    });

    if (!player) {
      player = await this.prisma.player.create({
        data: {
          name: playerName,
          normalizedName: normalized,
          aliases: [playerName, normalized, ...playerName.split(' ')],
        },
      });
    }

    for (const t of teamsList) {
      if (!t.name || t.name === '-' || t.name === 'Without Club') continue;

      let team = await this.prisma.team.findFirst({
        where: { name: { contains: t.name, mode: 'insensitive' } },
      });

      if (!team) {
        team = await this.prisma.team.create({
          data: {
            name: t.name,
            logo: t.logo || 'https://media.api-sports.io/football/teams/541.png',
          },
        });
      }

      await this.prisma.playerCareer.upsert({
        where: { playerId_teamId: { playerId: player.id, teamId: team.id } },
        update: {},
        create: {
          playerId: player.id,
          teamId: team.id,
        },
      });
    }

    this.logger.log(`✅ Transfermarkt data for "${playerName}" imported to PostgreSQL (${teamsList.length} teams linked)`);
  }
}
