const Blog = require('../models/blog');

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  let favorite = blogs[0];
  for (let i = 1; i < blogs.length; i++) {
    if (blogs[i].likes > favorite.likes) {
      favorite = blogs[i];
    }
  }
  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes,
  };
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const blogCounts = {};

  blogs.forEach((blog) => {
    if (blog.author in blogCounts) {
      blogCounts[blog.author]++;
    } else {
      blogCounts[blog.author] = 1;
    }
  });

  let mostBlogsAuthor = '';
  let mostBlogsCount = 0;

  for (const author in blogCounts) {
    if (blogCounts[author] > mostBlogsCount) {
      mostBlogsAuthor = author;
      mostBlogsCount = blogCounts[author];
    }
  }

  return {
    author: mostBlogsAuthor,
    blogs: mostBlogsCount,
  };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const likesByAuthor = {};

  blogs.forEach((blog) => {
    if (blog.author in likesByAuthor) {
      likesByAuthor[blog.author] += blog.likes;
    } else {
      likesByAuthor[blog.author] = blog.likes;
    }
  });

  let mostLikesAuthor = '';
  let mostLikesCount = 0;

  for (const author in likesByAuthor) {
    if (likesByAuthor[author] > mostLikesCount) {
      mostLikesAuthor = author;
      mostLikesCount = likesByAuthor[author];
    }
  }

  return {
    author: mostLikesAuthor,
    likes: mostLikesCount,
  };
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map(blog => blog.toJSON());
};

const nonExistingId = async () => {
  const blog = new Blog();
  await blog.save();
  await blog.remove();
  return blog._id.toString();
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
  blogsInDb,
  nonExistingId,
};
