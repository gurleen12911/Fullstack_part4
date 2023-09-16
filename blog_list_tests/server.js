const app = require('./index'); 
const PORT = process.env.PORT || 3003;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
