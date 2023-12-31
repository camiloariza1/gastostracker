const Expense = require('../models/expense');
const formattedDate = require('../utils/formattedDate');

module.exports = (bot) => {

    bot.command('list', async (ctx) => {
        const { from } = ctx.message;
        try {
            const expenses = await Expense.find({ user_id: from.id });
            if (expenses.length === 0) {
                ctx.reply('No hay gastos registrados.');
            } else {
                let message = 'Lista de gastos:\n\n';
                expenses.forEach((expense, index) => {
                    let formattedDateStr = formattedDate(expense.createdAt); // Use createdAt for the date
                    message += `${index + 1}. ${expense.monto} (${formattedDateStr}): ${expense.asunto} / Categoria:(${expense.categoria})\n`;
                });
                ctx.reply(message);
            }
        } catch (error) {
            console.error(error);
            ctx.reply('Ocurrió un error al obtener los gastos.');
        }
    });

}