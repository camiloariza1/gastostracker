const Expense = require('../models/expense');
const formattedDate = require('../utils/formattedDate');

module.exports = async (ctx) => {
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
  };