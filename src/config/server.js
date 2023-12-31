require('dotenv').config();

const mongoose = require('mongoose');
const bot = require('../app.js');
const DATABASE_URL = process.env.DATABASE_URL;

async function connectToDatabase() {
  try {
    await mongoose.connect(DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to the database successfully");
  } catch (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1);
  }
}

async function main() {
  await connectToDatabase();

  // Launch the Telegram bot
  bot.launch()
    .then(() => console.log('Bot running...'))
    .catch(error => console.error('Error launching the bot:', error));
}

main();