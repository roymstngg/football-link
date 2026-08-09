import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { GameService } from './game.service';

interface QueueUser {
  socketId: string;
  userId: string;
  username: string;
  avatar?: string;
  eloRating: number;
}

interface MatchRoom {
  id: string;
  roomCode?: string;
  isPrivate?: boolean;
  player1: QueueUser;
  player2?: QueueUser;
  scorePlayer1: number;
  scorePlayer2: number;
  phase: 'waiting_friend' | 'selecting_teams' | 'playing' | 'tictactoe';
  gameMode?: 'speed' | 'tictactoe';
  teamA?: any;
  teamB?: any;
  selectTimerSeconds: number;
  selectTimerInterval?: NodeJS.Timeout;
  roundTimerSeconds: number;
  roundTimerInterval?: NodeJS.Timeout;
  round: number;
  maxRounds: number;
  usedPlayersInRoom: Set<string>;
  foundPlayersHistory: Array<{ playerName: string; guessedBy: string; points: number; isCorrect: boolean }>;
  ticTacToeGrid?: any;
  ticTacToeBoard?: Array<Array<{ symbol: 'X' | 'O' | null; playerName?: string; claimedBy?: string }>>;
  currentTurnUserId?: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(GameGateway.name);
  private matchmakingQueue: QueueUser[] = [];
  private tttMatchmakingQueue: QueueUser[] = [];
  private activeRooms: Map<string, MatchRoom> = new Map();
  private privateRoomsByCode: Map<string, MatchRoom> = new Map();

  constructor(private readonly gameService: GameService) {}

  handleConnection(client: Socket) {
    this.logger.log(`⚡ [CANLI OYUNCU BAĞLANDI] Socket ID: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`❌ [BAĞLANTI KESİLDİ] Socket ID: ${client.id}`);
    this.matchmakingQueue = this.matchmakingQueue.filter((u) => u.socketId !== client.id);
    this.tttMatchmakingQueue = this.tttMatchmakingQueue.filter((u) => u.socketId !== client.id);

    for (const [roomId, room] of this.activeRooms.entries()) {
      if (room.player1.socketId === client.id || (room.player2 && room.player2.socketId === client.id)) {
        if (room.selectTimerInterval) clearInterval(room.selectTimerInterval);
        if (room.roundTimerInterval) clearInterval(room.roundTimerInterval);

        const winner = room.player1.socketId === client.id ? room.player2 : room.player1;
        if (winner) {
          this.server.to(roomId).emit('matchEnded', {
            reason: 'opponent_disconnected',
            winnerId: winner.userId,
            winnerName: winner.username,
            message: `Rakip oyundan ayrıldığı için maçı ${winner.username} kazandı!`,
          });
        }
        this.activeRooms.delete(roomId);
        if (room.roomCode) this.privateRoomsByCode.delete(room.roomCode);
        break;
      }
    }
  }

  @SubscribeMessage('joinQueue')
  async handleJoinQueue(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: string; username: string; avatar?: string },
  ) {
    const user: QueueUser = {
      socketId: client.id,
      userId: `${data.userId || 'user'}_${client.id}`,
      username: data.username || `Oyuncu-${client.id.substring(0, 4)}`,
      avatar: data.avatar,
      eloRating: 0,
    };

    this.logger.log(`🎮 [1v1 ARAMA] ${user.username} sıraya girdi.`);
    this.matchmakingQueue = this.matchmakingQueue.filter((u) => u.socketId !== client.id);
    this.matchmakingQueue.push(user);

    client.emit('queueStatus', { inQueue: true, position: this.matchmakingQueue.length });

    if (this.matchmakingQueue.length >= 2) {
      const p1 = this.matchmakingQueue.shift()!;
      const p2 = this.matchmakingQueue.shift()!;
      this.logger.log(`⚔️ [CANLI MAÇ BAŞLADI] ${p1.username} vs ${p2.username}`);
      await this.startMatchSimultaneousDraft(p1, p2);
    }
  }

  @SubscribeMessage('joinTTTQueue')
  async handleJoinTTTQueue(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: string; username: string },
  ) {
    const user: QueueUser = {
      socketId: client.id,
      userId: `${data.userId || 'user'}_${client.id}`,
      username: data.username || `Oyuncu-${client.id.substring(0, 4)}`,
      eloRating: 0,
    };

    this.logger.log(`❌⭕ [TIC-TAC-TOE ARAMA] ${user.username} sıraya girdi.`);
    this.tttMatchmakingQueue = this.tttMatchmakingQueue.filter((u) => u.socketId !== client.id);
    this.tttMatchmakingQueue.push(user);

    client.emit('queueStatus', { inQueue: true, position: this.tttMatchmakingQueue.length });

    if (this.tttMatchmakingQueue.length >= 2) {
      const p1 = this.tttMatchmakingQueue.shift()!;
      const p2 = this.tttMatchmakingQueue.shift()!;

      const roomId = `ttt_room_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      const room: MatchRoom = {
        id: roomId,
        player1: p1,
        player2: p2,
        scorePlayer1: 0,
        scorePlayer2: 0,
        phase: 'tictactoe',
        gameMode: 'tictactoe',
        selectTimerSeconds: 10,
        roundTimerSeconds: 10,
        round: 1,
        maxRounds: 5,
        usedPlayersInRoom: new Set(),
        foundPlayersHistory: [],
      };

      this.activeRooms.set(roomId, room);

      const socket1 = this.server.sockets.sockets.get(p1.socketId);
      const socket2 = this.server.sockets.sockets.get(p2.socketId);
      socket1?.join(roomId);
      socket2?.join(roomId);

      this.logger.log(`❌⭕ [CANLI TIC-TAC-TOE MAÇI] ${p1.username} vs ${p2.username}`);
      await this.startTicTacToeMatch(room);
    }
  }

  @SubscribeMessage('leaveQueue')
  handleLeaveQueue(@ConnectedSocket() client: Socket) {
    this.matchmakingQueue = this.matchmakingQueue.filter((u) => u.socketId !== client.id);
    this.tttMatchmakingQueue = this.tttMatchmakingQueue.filter((u) => u.socketId !== client.id);
    client.emit('queueStatus', { inQueue: false });
  }

  /**
   * CREATE PRIVATE ROOM (PLAY WITH FRIENDS)
   */
  @SubscribeMessage('createPrivateRoom')
  async handleCreatePrivateRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: string; username: string; gameMode?: 'speed' | 'tictactoe' },
  ) {
    const user: QueueUser = {
      socketId: client.id,
      userId: `${data.userId || 'user'}_${client.id}`,
      username: data.username || `Oyuncu-${client.id.substring(0, 4)}`,
      eloRating: 0,
    };

    const roomCode = Math.floor(100000 + Math.random() * 900000).toString();
    const roomId = `private_${roomCode}`;

    const room: MatchRoom = {
      id: roomId,
      roomCode,
      isPrivate: true,
      player1: user,
      scorePlayer1: 0,
      scorePlayer2: 0,
      phase: 'waiting_friend',
      gameMode: data.gameMode || 'speed',
      selectTimerSeconds: 10,
      roundTimerSeconds: 10,
      round: 1,
      maxRounds: 5,
      usedPlayersInRoom: new Set(),
      foundPlayersHistory: [],
    };

    this.activeRooms.set(roomId, room);
    this.privateRoomsByCode.set(roomCode, room);

    client.join(roomId);
    this.logger.log(`🔑 PRIVATE FRIEND ROOM CREATED: Code ${roomCode} by ${user.username}`);

    client.emit('privateRoomCreated', {
      roomId,
      roomCode,
      message: `Oda Oluşturuldu! Kod: ${roomCode}. Arkadaşını davet et!`,
    });
  }

  /**
   * JOIN PRIVATE ROOM BY CODE
   */
  @SubscribeMessage('joinPrivateRoom')
  async handleJoinPrivateRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomCode: string; userId: string; username: string },
  ) {
    const room = this.privateRoomsByCode.get(data.roomCode.trim());

    if (!room || room.player2) {
      client.emit('privateRoomError', { message: 'Geçersiz veya dolu oda kodu!' });
      return;
    }

    const p2: QueueUser = {
      socketId: client.id,
      userId: `${data.userId || 'user'}_${client.id}`,
      username: data.username || `Oyuncu-${client.id.substring(0, 4)}`,
      eloRating: 1000,
    };

    room.player2 = p2;
    client.join(room.id);

    this.logger.log(`🔑 FRIEND JOINED ROOM ${room.roomCode}: ${p2.username} vs ${room.player1.username}`);

    if (room.gameMode === 'tictactoe') {
      await this.startTicTacToeMatch(room);
    } else {
      await this.startMatchSimultaneousDraft(room.player1, p2, room);
    }
  }

  private async startMatchSimultaneousDraft(p1: QueueUser, p2: QueueUser, existingRoom?: MatchRoom) {
    const roomId = existingRoom ? existingRoom.id : `room_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const room: MatchRoom = existingRoom || {
      id: roomId,
      player1: p1,
      player2: p2,
      scorePlayer1: 0,
      scorePlayer2: 0,
      phase: 'selecting_teams',
      selectTimerSeconds: 20,
      roundTimerSeconds: 30,
      round: 1,
      maxRounds: 5,
      usedPlayersInRoom: new Set(),
      foundPlayersHistory: [],
    };

    room.player2 = p2;
    this.activeRooms.set(roomId, room);

    const socket1 = this.server.sockets.sockets.get(p1.socketId);
    const socket2 = this.server.sockets.sockets.get(p2.socketId);
    socket1?.join(roomId);
    socket2?.join(roomId);

    this.server.to(roomId).emit('matchFound', {
      roomId,
      player1: { userId: p1.userId, username: p1.username, avatar: p1.avatar },
      player2: { userId: p2.userId, username: p2.username, avatar: p2.avatar },
      phase: 'selecting_teams',
      selectTimeLimit: 20,
      message: '20 saniyeniz var! İki oyuncu da aynı anda takımını seçiyor...',
    });

    this.startDraftTimerForRoom(room);
  }

  private startDraftTimerForRoom(room: MatchRoom) {
    if (room.selectTimerInterval) clearInterval(room.selectTimerInterval);
    if (room.roundTimerInterval) clearInterval(room.roundTimerInterval);

    room.phase = 'selecting_teams';
    room.teamA = undefined;
    room.teamB = undefined;
    room.selectTimerSeconds = 20;

    this.server.to(room.id).emit('startRoundDraft', {
      round: room.round,
      targetScore: 3,
      selectTimeLimit: 20,
      message: `🔔 Tur ${room.round} başladı! 20 saniyeniz var, yeni takımınızı seçin!`,
    });

    room.selectTimerInterval = setInterval(async () => {
      room.selectTimerSeconds--;
      this.server.to(room.id).emit('selectTimerTick', { secondsLeft: room.selectTimerSeconds });

      if (room.selectTimerSeconds <= 0) {
        clearInterval(room.selectTimerInterval!);
        await this.finalizeTeamSelections(room);
      }
    }, 1000);
  }

  @SubscribeMessage('selectSimultaneousTeam')
  async handleSelectSimultaneousTeam(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; teamId: string },
  ) {
    const room = this.activeRooms.get(data.roomId);
    if (!room || room.phase !== 'selecting_teams') return;

    const isPlayer1 = room.player1.socketId === client.id;
    const isPlayer2 = room.player2 && room.player2.socketId === client.id;

    const selectedTeam = await this.gameService.findTeamById(data.teamId);
    if (!selectedTeam) return;

    if (isPlayer1 && !room.teamA) {
      room.teamA = selectedTeam;
    } else if (isPlayer2 && !room.teamB) {
      room.teamB = selectedTeam;
    }

    this.server.to(room.id).emit('teamSelectAck', {
      player1Selected: !!room.teamA,
      player2Selected: !!room.teamB,
      teamAName: room.teamA?.name,
      teamBName: room.teamB?.name,
    });

    if (room.teamA && room.teamB) {
      if (room.selectTimerInterval) clearInterval(room.selectTimerInterval);
      await this.finalizeTeamSelections(room);
    }
  }

  private async finalizeTeamSelections(room: MatchRoom) {
    let teamAId = room.teamA?.id;
    let teamBId = room.teamB?.id;

    const pairInfo = await this.gameService.getCustomTeamPair(teamAId, teamBId);
    room.teamA = pairInfo.teamA;
    room.teamB = pairInfo.teamB;

    room.phase = 'playing';

    this.server.to(room.id).emit('matchStartedWithTeams', {
      phase: 'playing',
      teamPair: pairInfo,
      player1: { userId: room.player1.userId, username: room.player1.username },
      player2: { userId: room.player2!.userId, username: room.player2!.username },
      roundTimeLimit: 30,
      targetScore: 3,
      round: room.round,
      message: `Tur ${room.round} Hız Yarışı! 🎯 ${room.teamA.name} ⚡ ${room.teamB.name} - İlk bilen puanı kapar!`,
    });

    this.start30sRoundTimer(room);
  }

  private start30sRoundTimer(room: MatchRoom) {
    if (room.roundTimerInterval) clearInterval(room.roundTimerInterval);
    room.roundTimerSeconds = 30;

    room.roundTimerInterval = setInterval(async () => {
      room.roundTimerSeconds--;
      this.server.to(room.id).emit('timerTick', { secondsLeft: room.roundTimerSeconds });

      if (room.roundTimerSeconds <= 0) {
        clearInterval(room.roundTimerInterval!);
        await this.handle30sRoundTimeout(room);
      }
    }, 1000);
  }

  private async handle30sRoundTimeout(room: MatchRoom) {
    this.server.to(room.id).emit('roundTimeout', {
      message: `⏰ 30 saniye doldu! Bilen çıkmadı. Tur ${room.round} bitti! Yeni tur seçimi başlıyor...`,
      round: room.round,
    });

    room.round++;
    await this.advanceToNextRound(room);
  }

  private async advanceToNextRound(room: MatchRoom) {
    this.startDraftTimerForRoom(room);
  }

  @SubscribeMessage('submitAnswer')
  async handleSubmitAnswer(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; playerInput: string },
  ) {
    const room = this.activeRooms.get(data.roomId);
    if (!room || room.phase !== 'playing') return;

    const isPlayer1 = room.player1.socketId === client.id;
    const isPlayer2 = room.player2 && room.player2.socketId === client.id;
    if (!isPlayer1 && !isPlayer2) return;

    const senderUsername = isPlayer1 ? room.player1.username : room.player2!.username;

    const result = await this.gameService.verifyAnswer({
      teamAId: room.teamA.id,
      teamBId: room.teamB.id,
      playerInput: data.playerInput,
    });

    if (result.success) {
      if (room.usedPlayersInRoom.has(result.player.id)) {
        client.emit('answerResult', {
          success: false,
          message: `${result.player.name} daha önce zaten bilindi!`,
          senderUsername,
        });
        return;
      }

      if (room.roundTimerInterval) clearInterval(room.roundTimerInterval);
      room.usedPlayersInRoom.add(result.player.id);

      if (isPlayer1) room.scorePlayer1 += 1;
      else room.scorePlayer2 += 1;

      const historyEntry = {
        playerName: result.player.name,
        guessedBy: senderUsername,
        points: 1,
        isCorrect: true,
      };
      room.foundPlayersHistory.push(historyEntry);

      this.server.to(room.id).emit('answerResult', {
        success: true,
        message: `🏆 İLK BİLEN: ${senderUsername} (${result.player.name}) +1 PUAN!`,
        matchedPlayer: result.player,
        senderUsername,
        scores: { player1: room.scorePlayer1, player2: room.scorePlayer2 },
        round: room.round,
        history: room.foundPlayersHistory,
      });

      if (room.scorePlayer1 >= 3 || room.scorePlayer2 >= 3) {
        this.endMatch(room);
      } else {
        room.round++;
        await this.advanceToNextRound(room);
      }
    } else {
      this.server.to(room.id).emit('answerResult', {
        success: false,
        message: `✗ ${senderUsername}: '${data.playerInput}' yanlış cevap!`,
        senderUsername,
        scores: { player1: room.scorePlayer1, player2: room.scorePlayer2 },
      });
    }
  }

  /**
   * FOOTBALL TIC-TAC-TOE MATCH
   */
  private async startTicTacToeMatch(room: MatchRoom) {
    room.phase = 'tictactoe';
    room.ticTacToeGrid = await this.gameService.generateTicTacToeGrid();
    room.ticTacToeBoard = Array(3).fill(null).map(() => Array(3).fill(null).map(() => ({ symbol: null })));
    room.currentTurnUserId = room.player1.userId;

    this.server.to(room.id).emit('ticTacToeStarted', {
      roomId: room.id,
      grid: room.ticTacToeGrid,
      board: room.ticTacToeBoard,
      currentTurnUserId: room.currentTurnUserId,
      player1: room.player1,
      player2: room.player2,
      message: `Futbol Tic-Tac-Toe Başladı! Hamle sırası ${room.player1.username} (X)'de!`,
    });
  }

  @SubscribeMessage('submitTicTacToeMove')
  async handleSubmitTicTacToeMove(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; rowIndex: number; colIndex: number; playerInput: string },
  ) {
    const room = this.activeRooms.get(data.roomId);
    if (!room || room.phase !== 'tictactoe') return;

    const isPlayer1 = room.player1.socketId === client.id;
    const isPlayer2 = room.player2 && room.player2.socketId === client.id;
    const senderUserId = isPlayer1 ? room.player1.userId : room.player2?.userId;

    if (senderUserId !== room.currentTurnUserId) {
      client.emit('ticTacToeResult', { success: false, message: 'Henüz sizin sıranız değil!' });
      return;
    }

    const rowTeam = room.ticTacToeGrid.rowTeams[data.rowIndex];
    const colTeam = room.ticTacToeGrid.colTeams[data.colIndex];

    const result = await this.gameService.verifyAnswer({
      teamAId: rowTeam.id,
      teamBId: colTeam.id,
      playerInput: data.playerInput,
    });

    if (result.success) {
      const symbol: 'X' | 'O' = isPlayer1 ? 'X' : 'O';
      room.ticTacToeBoard[data.rowIndex][data.colIndex] = {
        symbol,
        playerName: result.player.name,
        claimedBy: isPlayer1 ? room.player1.username : room.player2!.username,
      };

      const winnerSymbol = this.checkTicTacToeWinner(room.ticTacToeBoard);

      if (winnerSymbol) {
        const winner = winnerSymbol === 'X' ? room.player1 : room.player2;
        this.server.to(room.id).emit('matchEnded', {
          reason: 'tictactoe_winner',
          winnerId: winner?.userId,
          winnerName: winner?.username,
          message: `🎉 TEBRİKLER! ${winner?.username} 3'lü dizilimi tamamlayarak Futbol Tic-Tac-Toe'yu KAZANDI!`,
          board: room.ticTacToeBoard,
        });
        this.activeRooms.delete(room.id);
        return;
      }

      // Next Turn
      room.currentTurnUserId = isPlayer1 ? room.player2!.userId : room.player1.userId;

      this.server.to(room.id).emit('ticTacToeResult', {
        success: true,
        message: `✓ ${result.player.name} kabul edildi! (${symbol} koyuldu)`,
        board: room.ticTacToeBoard,
        nextTurnUserId: room.currentTurnUserId,
      });
    } else {
      client.emit('ticTacToeResult', {
        success: false,
        message: result.message,
      });
    }
  }

  private checkTicTacToeWinner(board: Array<Array<{ symbol: 'X' | 'O' | null }>>): 'X' | 'O' | null {
    // Check rows, cols, diagonals
    for (let i = 0; i < 3; i++) {
      if (board[i][0].symbol && board[i][0].symbol === board[i][1].symbol && board[i][1].symbol === board[i][2].symbol) return board[i][0].symbol;
      if (board[0][i].symbol && board[0][i].symbol === board[1][i].symbol && board[1][i].symbol === board[2][i].symbol) return board[0][i].symbol;
    }
    if (board[0][0].symbol && board[0][0].symbol === board[1][1].symbol && board[1][1].symbol === board[2][2].symbol) return board[0][0].symbol;
    if (board[0][2].symbol && board[0][2].symbol === board[1][1].symbol && board[1][1].symbol === board[2][0].symbol) return board[0][2].symbol;
    return null;
  }

  private async endMatch(room: MatchRoom) {
    if (room.roundTimerInterval) clearInterval(room.roundTimerInterval);

    const winner =
      room.scorePlayer1 > room.scorePlayer2
        ? room.player1
        : room.scorePlayer2 > room.scorePlayer1
        ? room.player2
        : null;

    if (room.player1 && room.player2) {
      await this.gameService.saveMatchHistory(room.player1.userId, room.player2.username, room.gameMode || 'speed', room.scorePlayer1, room.scorePlayer2, winner?.userId === room.player1.userId);
      await this.gameService.saveMatchHistory(room.player2.userId, room.player1.username, room.gameMode || 'speed', room.scorePlayer2, room.scorePlayer1, winner?.userId === room.player2.userId);
    }

    this.server.to(room.id).emit('matchEnded', {
      reason: 'rounds_completed',
      winnerId: winner ? winner.userId : 'draw',
      winnerName: winner ? winner.username : 'BERABERE',
      finalScore: {
        player1: { username: room.player1.username, score: room.scorePlayer1 },
        player2: { username: room.player2?.username, score: room.scorePlayer2 },
      },
      history: room.foundPlayersHistory,
    });
    this.activeRooms.delete(room.id);
  }
}
