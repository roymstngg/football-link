import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  async getStats() {
    const stats = await this.adminService.getSystemStats();
    return { success: true, stats };
  }

  @Get('users')
  async getUsers() {
    const users = await this.adminService.getAllUsers();
    return { success: true, users };
  }

  @Post('update-user')
  async updateUser(@Body() body: { userId: string; eloRating?: number; isBanned?: boolean; isAdmin?: boolean }) {
    const user = await this.adminService.updateUserStatus(body);
    return { success: true, user };
  }

  @Post('add-player')
  async addPlayer(@Body() body: { name: string; photo?: string; nationality?: string; aliases?: string[]; teamIds?: string[] }) {
    const player = await this.adminService.addPlayer(body);
    return { success: true, player };
  }

  @Post('add-career')
  async addCareer(@Body() body: { playerId: string; teamId: string }) {
    const career = await this.adminService.addCareer(body);
    return { success: true, career };
  }

  @Delete('player/:id')
  async deletePlayer(@Param('id') id: string) {
    await this.adminService.deletePlayer(id);
    return { success: true, message: 'Oyuncu başarıyla silindi.' };
  }
}
