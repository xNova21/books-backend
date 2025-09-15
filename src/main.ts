import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // conectar microservicio Redis SOLO para recomendaciones
  app.connectMicroservice({
    transport: Transport.REDIS,
    options: {
      host: 'localhost',
      port: 6379,
    },
  });

  await app.startAllMicroservices();
  await app.listen(3000);

  console.log('HTTP server on http://localhost:3000');
  console.log('Redis microservice listening for recommendations');
}
bootstrap();
