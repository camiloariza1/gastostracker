const Expense = require('../models/expense');

module.exports = (bot) => {

  bot.command('clear', async (ctx) => {
    const { text, from } = ctx.message;
    const [indexStr] = text.split(' ').slice(1);
    const index = parseInt(indexStr);
  
    if (isNaN(index) || index < 1) {
      ctx.reply('Indice no válido.');
      return;
    }
  
    try {
      const expenses = await Expense.find({ user_id: from.id }).sort({ createdAt: 1 });
      if (index > expenses.length) {
        ctx.reply('Indice fuera del rango.');
        return;
      }
  
      const expenseToDelete = expenses[index - 1];
      await Expense.findByIdAndRemove(expenseToDelete._id);
      ctx.reply(`Gasto número ${index} eliminado.`);
    } catch (err) {
      console.error(err);
      ctx.reply('Error al eliminar gasto. Por favor intenta de nuevo.');
    }
  });  
}