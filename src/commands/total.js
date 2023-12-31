const Expense = require('../models/expense');

module.exports = (bot) => {
    bot.command('total', async (ctx) => {
        const { from } = ctx.message;
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1);
        console.log("Start of Month:", startOfMonth);
        console.log("End of Month:", endOfMonth);
    
        try {
            const res = await Expense.aggregate([
                {
                    $match: {
                        user_id: from.id,
                        createdAt: { $gte: startOfMonth, $lte: endOfMonth },
                    },
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$monto' },
                    },
                },
            ]);
            
            console.log("Aggregation Result:", res);
            const total = res[0]?.total || 0;
            ctx.reply(`El total gastado este mes fue de ${total}.`);
        } catch (err) {
            console.error(err);
            ctx.reply('Error al obtener el total gastado. Por favor intenta de nuevo.');
        }
    });    
}