const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../index'); 
const User = require('../models/user');
const api = supertest(app);

describe('User API', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  test('creating a new user', async () => {
    const newUser = {
      username: 'testuser',
      name: 'Test User',
      password: 'testpassword',
    };
  
    const response = await api.post('/api/users').send(newUser);
    
    expect(response.status).toBe(201);

  
    console.log(response.body); 
  
    const usersAtEnd = await User.find({});
    expect(usersAtEnd).toHaveLength(1);
    const usernames = usersAtEnd.map((user) => user.username);
    expect(usernames).toContain(newUser.username);
  });

  test('creating a new user with invalid data', async () => {
    const invalidUser = {
      name: 'Invalid User',
    };
  
    const response = await api.post('/api/users').send(invalidUser);
  
    expect(response.status).toBe(400);
    expect(response.body.error).toContain('Both username and password must be provided');
  });

  test('creating a new user with short username', async () => {
    const shortUsernameUser = {
      username: 'ab',
      name: 'Short Username User',
      password: 'password123',
    };
  
    const response = await api.post('/api/users').send(shortUsernameUser);
  
    expect(response.status).toBe(400);
    expect(response.body.error).toContain('Both username and password must be at least 3 characters long');
  });

  test('creating a new user with non-unique username', async () => {
    const initialUsers = [
      {
        username: 'user1',
        name: 'User One',
        password: 'password1',
      },
    ];

    await User.insertMany(initialUsers);

    const nonUniqueUsernameUser = {
      username: 'user1',
      name: 'Non-Unique User',
      password: 'password123',
    };
  
    const response = await api.post('/api/users').send(nonUniqueUsernameUser);
  
    expect(response.status).toBe(400);
    expect(response.body.error).toContain('Username must be unique');
  });

  test('get all users', async () => {
    const initialUsers = [
      {
        username: 'user1',
        name: 'User One',
        password: 'password1',
      },
      {
        username: 'user2',
        name: 'User Two',
        password: 'password2',
      },
    ];

    await User.insertMany(initialUsers);

    const response = await api.get('/api/users').expect(200);

    expect(response.body).toHaveLength(initialUsers.length);
    const usernames = response.body.map((user) => user.username);
    expect(usernames).toContain('user1');
    expect(usernames).toContain('user2');
  });
});
