import supertest from "supertest"
import app from "../app.js"
import mongoose from "mongoose"
import { cleanUpDatabase, generateValidJwt } from "./utils.js"
import User from "../models/userModel.js"

describe('GET /users', function() {
    afterEach(cleanUpDatabase);
    it('should return all users', async function() {
        const user = await User.create({
          email: 'test0.test@heig-vd.ch',
          password: 'Poisson123'
        });

        const token = await generateValidJwt(user);
        console.log(token);
        const res = await supertest(app)
  
        .get('/users')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /json/);
    });
});



describe('POST /users/register', function() {
    it('should create a user', async function() {
        const res = await supertest(app)
        .post('/users/register')
        .send({
          email: 'john.doe@heig-vd.ch',
          password: 'Poisson123'
        }) 
        .expect(201)
        .expect('Content-Type', /json/);
    });
});

describe('POST /users/login', function() {

  afterEach(cleanUpDatabase);

  it('should login a user', async function() {
      const res = await supertest(app)
      .post('/users/login')
      .send({
        email: 'john.doe@heig-vd.ch',
        password: 'Poisson123'
      })
      .expect(200)
      .expect('Content-Type', /json/);
  }
)});

describe('PATCH /users/:userId', function() {
    afterEach(cleanUpDatabase);
    it('should update a user', async function() {
        const user = await User.create({
          email: 'test.test@heig-vd.ch',
          password: 'Poisson123'
        });
        const token = await generateValidJwt(user);
        const res = await supertest(app)
        .patch('/users/'+user._id)
        .set('Authorization', `Bearer ${token}`)
        .send({
          email: 'test1.test@heig-vd.ch'
        })
        .expect(200)
        .expect('Content-Type', /json/);
    }
)});

describe('DELETE /users/:userId', function() {
    afterEach(cleanUpDatabase);
    it('should delete a user', async function() {
        const user = await User.create({
          email: 'test2.test@heig-vd.ch',
          password: 'Poisson123'
        });

        const token = await generateValidJwt(user);
        const res = await supertest(app)
        .delete('/users/'+user._id)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /json/);
    }
)});



  





afterAll(async () => {
  await mongoose.disconnect();
});