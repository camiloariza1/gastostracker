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
const helpCommand = require('./commands/help');

console.log('Bot running...');

startCommand(bot);
addCommand(bot);
listCommand(bot);
clearCommand(bot);
clearAllCommand(bot);
totalCommand(bot);
helpCommand(bot);

module.exports = bot;