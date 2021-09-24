import {Markup, Telegraf} from "telegraf";
import {PersistenceService} from "../services/persistence.service";

export class InboxBot {
    private readonly token = '1962793096:AAE_QnHCriPN-VTPCCUASA6RMuSpk4EidBU';


    public constructor(
        private readonly persistence: PersistenceService
    ) {
        this.setUp();
    }


    public setUp(): void {
        const bot = new Telegraf(this.token);

        bot.command('start', async ctx => {
            ctx.deleteMessage();
            await ctx.replyWithMarkdown('Are you familiar with gtd system?', Markup.inlineKeyboard([
                Markup.button.callback('Yes', 'familiarWithGtd'),
                Markup.button.callback('No', 'unfamiliarWithGtd')
            ]));
        });

        bot.action('familiarWithGtd', ctx => {
           ctx.reply('Cool, type your first thing', this.keyboard);
        });

        bot.action('unfamiliarWithGtd', ctx => {
            ctx.reply('So you need to look up first', this.keyboard);
        });

        bot.hears('Process', ctx => {
            ctx.deleteMessage();
            ctx.reply('Ups... Not yet');
        });

        bot.hears('Show', async ctx => {
            ctx.deleteMessage();
            const userId = ctx.update.message.from.id;
            const user = await this.persistence.getUser(userId);
            if (user) {
                const inboxString = user.inbox?.map((x,i) => i + 1 + '. ' + x.text).join('\n');
                await ctx.replyWithMarkdown('*Total items:* ' + user.inbox?.length + '\n------------------------------\n' + inboxString);
            } else {
                ctx.reply('Seems you have no items');
            }
        });

        bot.on('text', async ctx => {
            ctx.deleteMessage();
            const user = ctx.update.message.from;
            const isUserExists = !! await this.persistence.getUser(user.id);
            if (isUserExists) {
                await this.persistence.addInboxItem(user.id, ctx.message.text);
            } else {
                await this.persistence.addUser({
                    id: user.id,
                    first_name: user.first_name,
                    inbox: [{
                        text: ctx.message.text
                    }]
                })
            }
            await ctx.replyWithMarkdown('*Added:* \n' + ctx.message.text);
        });


        bot.launch();
        process.once('SIGINT', () => bot.stop('SIGINT'));
        process.once('SIGTERM', () => bot.stop('SIGTERM'));
    }

    private keyboard = Markup.keyboard([
        'Process',
        'Show'
    ]);
}

