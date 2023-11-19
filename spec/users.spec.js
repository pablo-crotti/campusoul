import supertest from "supertest"
import app from "../app.js"

describe('POST /users/register', function() {
    it('should create a user', async function() {
        const res = await supertest(app)
        .post('/users')
        .send({
          email: 'john.doe@heig-vd.ch',
          password: 'poisson123'
        })
        .expect(200)
        .expect('Content-Type', /json/);
    });
});