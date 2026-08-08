import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { GameService, VerifyAnswerDto } from './game.service';

@Controller('api/game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get('tictactoe-grid')
  async getTicTacToeGrid() {
    return this.gameService.generateTicTacToeGrid();
  }

  @Get('explore-players')
  async explorePlayers(@Query('query') query: string) {
    return this.gameService.explorePlayers(query);
  }

  @Get('search-teams')
  async searchTeams(@Query('query') query: string) {
    return this.gameService.searchTeams(query);
  }

  @Get('custom-pair')
  async getCustomPair(
    @Query('teamAId') teamAId: string,
    @Query('teamBId') teamBId: string,
  ) {
    return this.gameService.getCustomTeamPair(teamAId, teamBId);
  }

  @Get('random-pair')
  async getRandomPair() {
    return this.gameService.getRandomTeamPair();
  }

  @Post('verify-answer')
  async verifyAnswer(@Body() dto: VerifyAnswerDto) {
    return this.gameService.verifyAnswer(dto);
  }

  @Get('match-history/:userId')
  async getMatchHistory(@Query('userId') userId: string) {
    return this.gameService.getMatchHistory(userId);
  }
}
