module.exports = (bot) => {
    bot.command('help', (ctx) => {
        let helpMessage = `Commands available:\n`;
        helpMessage += `/start - Start interacting with the bot\n`;
        helpMessage += `/add <amount> <category> <description> - Add a new expense\n`;
        helpMessage += `/list - List all your recorded expenses\n`;
        helpMessage += `/clear <index> - Remove an expense by its index\n`;
        helpMessage += `/clearall - Remove all your expenses\n`;
        helpMessage += `/total - Show the total amount of your expenses\n`;
        helpMessage += `/help - Show this help message\n`;

        ctx.reply(helpMessage);
    });
};