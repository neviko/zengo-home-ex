import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should be failed v1- missing coins query param', () => {
    return request(app.getHttpServer())
      .get('/coins-compare?date=2019-07-21')
      .expect(400)
      .expect('Hello World!');
  });
  it('should be failed v2- missing date query param', () => {
    return request(app.getHttpServer())
      .get('/coins-compare?coins=ETH,BTC,IMX')
      .expect(400)
      .expect('Hello World!');
  });
  it('should success - capital letters', () => {
    return request(app.getHttpServer())
      .get('/coins-compare?coins=ETH,BTC,IMX&date=2019-07-21')
      .expect(400)
      .expect('Hello World!');
  });
  it('should success - small letters', () => {
    return request(app.getHttpServer())
      .get('/coins-compare?coins=eth,btc,imx&date=2019-07-21')
      .expect(400)
      .expect('Hello World!');
  });
});
