import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() body: { fullName?: string; username: string; email: string; password?: string; favTeam?: string },
  ) {
    return this.authService.register(body);
  }

  @Post('verify-code')
  async verifyCode(@Body() body: { email: string; code: string }) {
    return this.authService.verifyCode(body);
  }

  @Post('login')
  async login(@Body() body: { usernameOrEmail: string; password?: string }) {
    return this.authService.login(body);
  }

  @Post('google')
  async googleAuth(@Body() body: { email: string; name: string; googleId?: string }) {
    return this.authService.googleAuth(body);
  }

  @Post('update-profile')
  async updateProfile(
    @Body() body: { userId: string; fullName?: string; favTeam?: string; avatarUrl?: string; bio?: string },
  ) {
    return this.authService.updateProfile(body);
  }
}
