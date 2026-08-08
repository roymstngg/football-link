import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiFootballService {
  private readonly logger = new Logger(ApiFootballService.name);
  private readonly baseUrl = 'https://v3.football.api-sports.io';
  private readonly apiKey: string;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('API_FOOTBALL_KEY') || 'b4056fd9835353ae1b6aede1babef9f0';
  }

  private get headers() {
    return {
      'x-apisports-key': this.apiKey,
    };
  }

  async getCountries(): Promise<any[]> {
    try {
      this.logger.log('🌐 LIVE API FETCH: Getting countries from API-Sports...');
      const response = await axios.get(`${this.baseUrl}/countries`, { headers: this.headers });
      return response.data.response || [];
    } catch (error) {
      this.logger.error(`Failed to fetch countries: ${error.message}`);
      return [];
    }
  }

  async getLeagues(): Promise<any[]> {
    try {
      this.logger.log('🌐 LIVE API FETCH: Getting leagues (Country: ALL)...');
      const response = await axios.get(`${this.baseUrl}/leagues`, { headers: this.headers });
      return response.data.response || [];
    } catch (error) {
      this.logger.error(`Failed to fetch leagues: ${error.message}`);
      return [];
    }
  }

  async getTeamsByLeague(leagueId: number, season: number = 2023): Promise<any[]> {
    try {
      this.logger.log(`🌐 LIVE API FETCH: Getting teams for League ID ${leagueId}...`);
      const response = await axios.get(`${this.baseUrl}/teams`, {
        headers: this.headers,
        params: { league: leagueId, season },
      });
      return response.data.response || [];
    } catch (error) {
      this.logger.error(`Failed to fetch teams for league ${leagueId}: ${error.message}`);
      return [];
    }
  }

  async getSquadByTeam(teamApiId: number): Promise<any[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/players/squads`, {
        headers: this.headers,
        params: { team: teamApiId },
      });
      const data = response.data.response || [];
      if (data.length > 0 && data[0].players) {
        return data[0].players.map((p: any) => ({
          player: {
            id: p.id,
            name: p.name,
            age: p.age,
            number: p.number,
            position: p.position,
            photo: p.photo,
          },
        }));
      }
      return [];
    } catch (error) {
      this.logger.error(`Failed to fetch squad for team ${teamApiId}: ${error.message}`);
      return [];
    }
  }

  async getTransfersByTeam(teamApiId: number): Promise<any[]> {
    try {
      this.logger.log(`🌐 LIVE API FETCH: Getting transfers for Team ID ${teamApiId}...`);
      const response = await axios.get(`${this.baseUrl}/transfers`, {
        headers: this.headers,
        params: { team: teamApiId },
      });
      return response.data.response || [];
    } catch (error) {
      this.logger.error(`Failed to fetch transfers for team ${teamApiId}: ${error.message}`);
      return [];
    }
  }

  async getTransfersByPlayer(playerApiId: number): Promise<any[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/transfers`, {
        headers: this.headers,
        params: { player: playerApiId },
      });
      return response.data.response || [];
    } catch (error) {
      this.logger.error(`Failed to fetch transfers for player ${playerApiId}: ${error.message}`);
      return [];
    }
  }
}
