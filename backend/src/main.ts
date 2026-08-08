import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`\n==================================================`);
  console.log(`⚽ Football Link NestJS Backend Running on Port ${port}`);
  console.log(`==================================================\n`);
}
bootstrap();
