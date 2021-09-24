import {Telegraf} from 'telegraf';


const bot = new Telegraf("1962793096:AAE_QnHCriPN-VTPCCUASA6RMuSpk4EidBU");

bot.on('text', ctx => {
   ctx.reply(ctx.message.text);
});



bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))