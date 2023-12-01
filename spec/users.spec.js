import supertest from "supertest"
import app from "../app.js"
import mongoose from "mongoose"
import { cleanUpDatabase, generateValidJwt } from "./utils.js"
import User from "../models/userModel.js"

/**
* Test case for the 'POST /users/register' endpoint.
* It should create a user with the provided email and password.
*/
describe('POST /users/register', function () {
  /**
  * Test scenario: User registration is successful.
  * 
  * @request
  * Request method: POST
  * Request URL: /users/register
  * Request body: { email: 'john.doe@heig-vd.ch', password: 'Poisson123' }
  * 
  * @response
  * Expected status code: 201 (Created)
  * Expected content type: JSON
  * 
  * @assertions
  * - The response body should be an object.
  * - The response body should contain keys: 'user' and 'token'.
  */
  it('should create a user', async function () {
    const res = await supertest(app)
      .post('/users/register')
      .send({
        email: 'john.doe@heig-vd.ch',
        password: 'Poisson123'
      })
      .expect(201)
      .expect('Content-Type', /json/);

    expect(res.body).toBeObject();
    expect(res.body).toContainAllKeys(['user', 'token'])
  });
});

/**
* Test case for the 'POST /users/login' endpoint.
* It should authenticate and login a user with valid credentials.
*/
describe('POST /users/login', function () {
  /**
  * Test scenario: User login is successful with valid credentials.
  * 
  * @request
  * Request method: POST
  * Request URL: /users/login
  * Request body: { email: 'john.doe@heig-vd.ch', password: 'Poisson123' }
  * 
  * @response
  * Expected status code: 200 (OK)
  * Expected content type: JSON
  * 
  * @assertions
  * - The response body should be an object.
  * - The response body should contain keys: 'user' and 'token'.
  */
  it('should login a user', async function () {
    const res = await supertest(app)
      .post('/users/login')
      .send({
        email: 'john.doe@heig-vd.ch',
        password: 'Poisson123'
      })
      .expect(200)
      .expect('Content-Type', /json/);

    expect(res.body).toBeObject();
    expect(res.body).toContainAllKeys(['user', 'token'])
  }
  )
});

/**
* Test case for the 'GET /users' endpoint.
* It should retrieve a list of all users.
*/
describe('GET /users', function () {
  afterEach(cleanUpDatabase);
  /**
  * Test scenario: Retrieve a list of all users.
  * 
  * @setup
  * Before each test, create two users in the database.
  * 
  * @request
  * Request method: GET
  * Request URL: /users
  * Request headers: Authorization (Bearer token)
  * 
  * @response
  * Expected status code: 200 (OK)
  * Expected content type: JSON
  * 
  * @assertions
  * - The response body should be an object.
  * - The response body should contain keys: 'total', 'page', 'totalPages', and 'users'.
  * - The 'users' key should be an array with a length of 2.
  */
  it('should return all users', async function () {
    const user = await User.create({
      email: 'test0.test@heig-vd.ch',
      password: 'Poisson123'
    });

    await User.create({
      email: 'test00.test@heig-vd.ch',
      password: 'Poisson123'
    });

    const token = await generateValidJwt(user);
    const res = await supertest(app)

      .get('/users')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /json/);

    expect(res.body).toBeObject();
    expect(res.body.users).toHaveLength(2);
    expect(res.body).toContainAllKeys(["total", "page", "totalPages", "users"])
  });
});

describe('PATCH /users/:userId', function () {
  afterEach(cleanUpDatabase);
  it('should update a user', async function () {
    const user = await User.create({
      email: 'test.test@heig-vd.ch',
      password: 'Poisson123'
    });
    const token = await generateValidJwt(user);
    const res = await supertest(app)
      .patch('/users/' + user._id)
      .set('Authorization', `Bearer ${token}`)
      .send({
        email: 'test1.test@heig-vd.ch'
      })
      .expect(200)
      .expect('Content-Type', /json/);

    expect(res.body).toBeObject();
    expect(res.body).toContainAllKeys(['user'])
  }
  )
});

/**
* Test case for the 'PATCH /users/:userId' endpoint.
* It should update a user's information.
*/
describe('DELETE /users/:userId', function () {
  /**
  * Test scenario: Update a user's information.
  * 
  * @setup
  * Before each test, create a user in the database.
  * 
  * @request
  * Request method: PATCH
  * Request URL: /users/:userId (Replace :userId with the actual user's ID)
  * Request headers: Authorization (Bearer token)
  * Request body: { email: 'test1.test@heig-vd.ch' }
  * 
  * @response
  * Expected status code: 200 (OK)
  * Expected content type: JSON
  * 
  * @assertions
  * - The response body should be an object.
  * - The response body should contain the 'user' key.
  */
  it('should delete a user', async function () {
    const user = await User.create({
      email: 'test2.test@heig-vd.ch',
      password: 'Poisson123'
    });

    const token = await generateValidJwt(user);
    const res = await supertest(app)
      .delete('/users/' + user._id)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /json/);

    expect(res.body).toBeObject()
    expect(res.body).toContainAllKeys(['message'])
    expect(res.body.message).toBe("User deleted")
  }
  )
});

afterAll(async () => {
  await mongoose.disconnect();
});