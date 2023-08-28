const listHelper = require('../utils/list_helper');

describe('most blogs', () => {
  const blogs = [
    {
      title: 'Blog 1',
      author: 'Author 1',
      likes: 5,
    },
    {
      title: 'Blog 2',
      author: 'Author 2',
      likes: 10,
    },
    {
      title: 'Blog 3',
      author: 'Author 1',
      likes: 7,
    },
    {
      title: 'Blog 4',
      author: 'Author 3',
      likes: 2,
    },
  ];

  test('when list has only one blog, return that author with 1 blog', () => {
    const result = listHelper.mostBlogs([blogs[0]]);
    expect(result).toEqual({
      author: 'Author 1',
      blogs: 1,
    });
  });

  test('returns the author with the most blogs and their count', () => {
    const result = listHelper.mostBlogs(blogs);
    expect(result).toEqual({
      author: 'Author 1',
      blogs: 2,
    });
  });
});

describe('most likes', () => {
  const blogs = [
    {
      title: 'Blog 1',
      author: 'Author 1',
      likes: 5,
    },
    {
      title: 'Blog 2',
      author: 'Author 2',
      likes: 10,
    },
  ];

  test('when list has only one blog, return that author with their likes', () => {
    const result = listHelper.mostLikes([blogs[0]]);
    expect(result).toEqual({
      author: 'Author 1',
      likes: 5,
    });
  });

  test('returns the author with the most likes and their total likes', () => {
    const result = listHelper.mostLikes(blogs);
    expect(result).toEqual({
      author: 'Author 2',
      likes: 10,
    });
  });
});
