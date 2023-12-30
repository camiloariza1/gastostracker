const { Telegraf } = require('telegraf');
require('dotenv').config();

const BOT_TOKEN = process.env.BOT_TOKEN;
const bot = new Telegraf(BOT_TOKEN);

const startCommand = require('./commands/start');
const addCommand = require('./commands/add');
const listCommand = require('./commands/list');
const clearCommand = require('./commands/clear');
const clearAllCommand = require('./commands/clearall');
const totalCommand = require('./commands/total');

console.log('Bot running...');

bot.command('start', startCommand);
bot.command('add', addCommand);
bot.command('list', listCommand);
bot.command('clear', clearCommand);
bot.command('clearall', clearAllCommand);
bot.command('total', totalCommand);

bot.launch();

