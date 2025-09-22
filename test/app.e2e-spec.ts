import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.connectMicroservice({
      transport: 1, // Transport.REDIS
      options: { host: 'localhost', port: 6379 },
    });

    await app.startAllMicroservices();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // crea el test para usar el endpoint get recommendations
  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/book/recommendation/68d18ba17b4e763a3270c4fd')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('yourBooks');
        expect(res.body).toHaveProperty('category');
        expect(res.body).toHaveProperty('popular');
      });
  });
});
