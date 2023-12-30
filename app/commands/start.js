module.exports = async (ctx) => {

    bot.command('start', (ctx) => {
        ctx.reply('Hola, soy el bot de seguimiento de gastos de Camilo! Para adherir gastos usa * /add (categoria) (asunto) * seguido del monto del gasto.');
    });
}