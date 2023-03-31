require('dotenv').config();

const mongoose = require('mongoose');
const app = require('../app');

const PORT = 3000;

async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to the database successfully');
  } catch (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1);
  }
}

function startServer() {
  app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
  });
}

(async function main() {
  await connectToDatabase();
  startServer();
})();
