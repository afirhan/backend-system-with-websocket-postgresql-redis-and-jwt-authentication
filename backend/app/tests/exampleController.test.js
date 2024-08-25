const request = require('supertest');
const app = require('../../server');
const config = require("../config/auth.js");
const db = require('../../app/models');

beforeAll(async () => {
  await db.sequelize.sync({ force: true });
  await require('../../app/seeders/seed')();
});

afterAll(async () => {
  await db.sequelize.close();
});

describe('POST /api/refactoreMe2', () => {
  it('should successfully insert survey data and update user', async () => {
    const response = await request(app)
      .post('/api/refactoreMe2')
      .set('x-access-token', config.secret)
      .send({
        userId: 3,
        values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        id: 1
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe('Survey sent successfully!');
    expect(response.body.success).toBe(true);
  });
});

describe('GET /api/refactoreMe1', () => {
    it('should allow access for admin user', async () => {
  
        const response = await request(app)
            .get('/api/refactoreMe1')
            .set('x-access-token', config.secret)
            .send({
                userId: 1 
            });

        expect(response.statusCode).toBe(200);
        expect(response.body).toBeDefined();
    });
  
    it('should deny access for non-admin user', async () => {
  
      const response = await request(app)
        .get('/api/refactoreMe1')
        .set('x-access-token', config.secret)
        .send({
            userId: 2
        });
  
      expect(response.statusCode).toBe(403);
    });
});

describe('GET /api/getData', () => {
    it('should allow access for admin user', async () => {
  
        const response = await request(app)
            .get('/api/getData')
            .set('x-access-token', config.secret)
            .send({
                userId: 1 
            });

        expect(response.statusCode).toBe(200);
        expect(response.body).toBeDefined();
    });
  
    it('should deny access for non-admin user', async () => {
  
      const response = await request(app)
        .get('/api/getData')
        .set('x-access-token', config.secret)
        .send({
            userId: 2
        });
  
      expect(response.statusCode).toBe(403);
    });
});