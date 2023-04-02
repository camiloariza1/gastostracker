const { Telegraf } = require('telegraf');
require('dotenv').config();
const Expense = require('./models/expense');

const BOT_TOKEN = process.env.BOT_TOKEN;
const bot = new Telegraf(BOT_TOKEN);

console.log('Bot running...');

function formattedDate(date) {
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

bot.command('start', (ctx) => {
  ctx.reply('Hola, soy el bot de seguimiento de gastos de Camilo! Para adherir gastos usa * /add (categoria) (asunto) * seguido del monto del gasto.');
});

bot.command('add', async (ctx) => {
  const { text, from } = ctx.message;
  const [amount, category, ...message] = text.split(' ').slice(1);
  if (!isNaN(amount)) {
    const date = new Date();
    const expense = new Expense({
      monto: parseFloat(amount),
      categoria: category,
      asunto: message.join(' '),
      user_id: from.id,
    });
    try {
      await expense.save();
      ctx.reply(`Gasto de ${amount} fue adherido exitosamente en ${formattedDate(date)}.`);
    } catch (error) {
      console.error(error);
      ctx.reply('Error al guardar el gasto.');
    }    
  } else {
    ctx.reply('Mal formato. Intenta nuevamente con un numero valido.');
  }
});

bot.command('list', async (ctx) => {
  const { from } = ctx.message;
  try {
    const expenses = await Expense.find({ user_id: from.id });
    if (expenses.length === 0) {
      ctx.reply('No hay gastos registrados.');
    } else {
      let message = 'Lista de gastos:\n\n';
      expenses.forEach((expense, index) => {
        message += `${index + 1}. ${expense.monto} (${formattedDate(expense.date)}): ${expense.asunto} / Categoria:(${expense.categoria})\n`;
      });
      ctx.reply(message);
    }
  } catch (error) {
    console.error(error);
    ctx.reply('Ocurrió un error al obtener los gastos.');
  }
});

bot.command('clear', async (ctx) => {
  const { text, from } = ctx.message;
  const [index] = text.split(' ').slice(1);
  try {
    const expense = await Expense.findOne({ user_id: from.id }).skip(index - 1);
    if (expense) {
      await expense.remove();
      ctx.reply(`Gasto número ${index} eliminado.`);
    } else {
      ctx.reply('Indice no válido o lista de gastos vacía.');
    }
  } catch (err) {
    console.error(err);
    ctx.reply('Error al eliminar gasto. Por favor intenta de nuevo.');
  }
});

bot.command('clearall', async (ctx) => {
  const { from } = ctx.message;
  try {
    const res = await Expense.deleteMany({ user_id: from.id });
    const count = res.deletedCount;
    if (count > 0) {
        ctx.reply(`${count} gastos eliminados exitosamente.`);
    } else {
      ctx.reply('No hay gastos registrados para el usuario.');
    }
  } catch (err) {
    console.error(err);
    ctx.reply('Error al eliminar gastos. Por favor intenta de nuevo.');
  }
});

bot.command('total', async (ctx) => {
  const { from } = ctx.message;
  try {
    const res = await Expense.aggregate([
      {
        $match: {
          user_id: from.id,
          date: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            $lte: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
          },
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: '$monto',
          },
        },
      },
    ]);
    const total = res[0]?.total || 0;
    ctx.reply(`El total gastado este mes fue de ${total}.`);
  } catch (err) {
    console.error(err);
    ctx.reply('Error al obtener el total gastado. Por favor intenta de nuevo.');
  }
});

bot.launch();

