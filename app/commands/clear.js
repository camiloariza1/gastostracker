const Expense = require('../models/expense');

module.exports = async (ctx) => {

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
}