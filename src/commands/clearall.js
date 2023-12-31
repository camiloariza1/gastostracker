const Expense = require('../models/expense');

module.exports = (bot) => {
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
}