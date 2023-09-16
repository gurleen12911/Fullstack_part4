const bcryptjs = require('bcryptjs');
bcryptjs.hash = async (password, saltRounds) => {
  return 'mockedHashedPassword';
};
module.exports = bcryptjs;
