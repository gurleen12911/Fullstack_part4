const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../index');
const api = supertest(app);
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const middleware = require('../utils/middleware'); 

const initialBlogs = [
  {
    title: 'First Blog',
    author: 'John Doe',
    url: 'http://example.com/first-blog',
    likes: 10,
  },
];

const mockSecretKey = '558638cdba7ad617eb29553c654520bb19f0403fdf74cb10897686a74a05e6aa';

let token;

beforeAll(async () => {
  const mockTokenUser = {
    userId: 'mockUserId',
  };
  token = jwt.sign(mockTokenUser, mockSecretKey);
});

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({}); 
  
  const user = new User({
    username: 'testuser',
    name: 'Test User',
    passwordHash: 'mockedHashedPassword',
  });
  
  const savedUser = await user.save();

  const blog = new Blog({
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://example.com/test-blog',
    user: savedUser._id, 
  });
  
  await blog.save();

  const anotherBlog = new Blog({
    title: 'Another Blog',
    author: 'Another Author',
    url: 'http://example.com/another-blog',
    user: savedUser._id, 
  });
  
  await anotherBlog.save();
});

describe('Blog API', () => {
  test('blogs are returned as json', async () => {
    const response = await api.get('/api/blogs');
    expect(response.body).toHaveLength(initialBlogs.length + 1);
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('application/json');
    expect(Array.isArray(response.body)).toBe(true);
    response.body.forEach(blog => {
      expect(blog.id).toBeDefined();
      expect(blog.title).toBeDefined();
      expect(blog.author).toBeDefined();
      expect(blog.url).toBeDefined();
      if ('likes' in blog) {
        expect(blog.likes).toBeDefined();
      }
    });
  });

  test('a new blog post is created', async () => {
    const newBlog = {
      title: 'New Blog Post',
      author: 'Test Author',
      url: 'http://example.com/new-blog',
      likes: 5,
    };
  
    const initialBlogsResponse = await api.get('/api/blogs');
    const initialBlogCount = initialBlogsResponse.body.length;
  
    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/);
      
    const updatedBlogsResponse = await api.get('/api/blogs');
    const updatedBlogCount = updatedBlogsResponse.body.length;
  
    expect(updatedBlogCount).toBe(initialBlogCount + 1);
    expect(response.body.likes).toBe(5);
  });

  test('a new blog post is created with default likes', async () => {
    const newBlog = {
      title: 'New Blog Post',
      author: 'Test Author',
      url: 'http://example.com/new-blog',
    };
  
    const initialBlogsResponse = await api.get('/api/blogs');
    const initialBlogCount = initialBlogsResponse.body.length;
  
    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/);
      
    const updatedBlogsResponse = await api.get('/api/blogs');
    const updatedBlogCount = updatedBlogsResponse.body.length;
  
    expect(updatedBlogCount).toBe(initialBlogCount + 1);
    expect(response.body.likes).toBe(0);
  });

  test('Fails with 401 Unauthorized if token is missing', async () => {
    const newBlog = {
      title: 'New Blog Post',
      author: 'Test Author',
      url: 'http://example.com/new-blog',
      likes: 5,
    };
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/);
  });

  test('blogs have id property', async () => {
    const response = await api.get('/api/blogs');
    response.body.forEach(blog => {
      expect(blog.id).toBeDefined();
    });
  });

  test('users contain information about blogs they created', async () => {
    const response = await api.get('/api/users');
    response.body.forEach(user => {
      expect(user.blogs).toBeDefined();
      user.blogs.forEach(blog => {
        expect(blog.title).toBeDefined();
        expect(blog.author).toBeDefined();
        expect(blog.url).toBeDefined();
        if ('likes' in blog) {
          expect(blog.likes).toBeDefined();
        }
        expect(blog.id).toBeDefined();
        
        expect(blog.user).toBeDefined();
        expect(blog.user.username).toBeDefined();
        expect(blog.user.name).toBeDefined();
        expect(blog.user.id).toBeDefined();
      });
    });
  });
});
