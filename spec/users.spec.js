import supertest from "supertest"
import app from "../app.js"
import mongoose from "mongoose"
import { cleanUpDatabase, generateValidJwt } from "./utils.js"
import User from "../models/userModel.js"


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

// //test la route /users/:userId avec un token valide
// describe('GET /users/:userId', function() {

//   //afterEach(cleanUpDatabase);

//   it('should get a user', async function() {
//       const user = await User.create({
//         email: 'test@heig-vd.ch',
//         password: 'Poisson123'
//       });
//       const token = generateValidJwt(user);
//       const res = await supertest(app)
//       .get('/users/'+user._id)
//     })
//   });


  describe('PATCH /users/:userId', function() {
  
    it('should update a user', async function() {
        const user = await User.create({
          email: 'jesus.christ2@heig-vd.ch',
          password: 'Poisson123'
        });
        const token = await generateValidJwt(user);
        const res = await supertest(app)
        .patch('/users/'+user._id)
        .set('Authorization', `Bearer ${token}`)
        .send({
          email: 'mohammed.ali@heig-vd.ch'
        })
        .expect(200)
        .expect('Content-Type', /json/);
    }
  )}
  );

        





afterAll(async () => {
  await mongoose.disconnect();
});