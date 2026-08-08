import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/football_link?schema=public',
        },
      },
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('✅ PostgreSQL veritabanı bağlantısı başarılı!');
    } catch (error) {
      this.logger.error('⚠️ Veritabanı bağlantı uyarısı:', error.message);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
