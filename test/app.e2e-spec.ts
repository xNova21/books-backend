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

  describe('User Endpoints', () => {
    it('/user (POST) - success', () => {
      return request(app.getHttpServer())
        .post('/user')
        .send({
          username: 'testuser',
          email: 'testuser@example.com',
          password: 'password123',
        })
        .expect(201)
        .expect((res) => {
          expect(res.text).toBeDefined();
        });
    });

    it('/user (POST) - fail (existing email)', () => {
      return request(app.getHttpServer())
        .post('/user')
        .send({
          username: 'testuser2',
          email: 'testuser@example.com',
          password: 'password123',
        })
        .expect(400)
        .expect((res) => {
          expect(res?.body?.message).toBe(
            'A user already exists with that email',
          );
        });
    });

    it('/user/login (POST) - success', () => {
      return request(app.getHttpServer())
        .post('/user/login')
        .send({
          email: 'testuser@example.com',
          password: 'password123',
        })
        .expect((res) => {
          expect(res.text).toBeDefined();
        });
    });

    it('/user/login (POST) - fail (wrong password)', () => {
      return request(app.getHttpServer())
        .post('/user/login')
        .send({
          email: 'testuser@example.com',
          password: 'wrongpassword',
        })
        .expect(400)
        .expect((res) => {
          expect(res.body?.message).toBe('Invalid email or password');
        });
    });

    it('/user/update (POST) - success', async () => {
      const loginResponse = await request(app.getHttpServer())
        .post('/user/login')
        .send({
          email: 'testuser@example.com',
          password: 'password123',
        });

      return request(app.getHttpServer())
        .post('/user/update')
        .set('Authorization', `Bearer ${loginResponse.text}`)
        .send({
          newEmail: 'newemail@example.com',
        })
        .expect(201)
        .expect((res) => {
          expect(res.text).toBe('User email updated successfully');
        });
    });

    it('/ (GET)', async () => {
      const loginResponse = await request(app.getHttpServer())
        .post('/user/login')
        .send({
          email: 'newemail@example.com',
          password: 'password123',
        });

      return request(app.getHttpServer())
        .get('/book/recommendation')
        .set('Authorization', `Bearer ${loginResponse.text}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('yourBooks');
          expect(res.body).toHaveProperty('category');
          expect(res.body).toHaveProperty('popular');
        });
    });

    it('/user/delete (POST) - success', async () => {
      const loginResponse = await request(app.getHttpServer())
        .post('/user/login')
        .send({
          email: 'newemail@example.com',
          password: 'password123',
        });

      return request(app.getHttpServer())
        .post('/user/delete')
        .set('Authorization', `Bearer ${loginResponse.text}`)
        .send({
          password: 'password123',
        })
        .expect((res) => {
          expect(res.text).toBe('User deleted successfully');
        });
    });
  });
});
