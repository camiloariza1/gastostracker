const Expense = require('../models/expense');

module.exports = async (ctx) => {
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
}