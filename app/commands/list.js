const Expense = require('../models/expense');
const formattedDate = require('../utils/formattedDate');

module.exports = async (ctx) => {

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

}