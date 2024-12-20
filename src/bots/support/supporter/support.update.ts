import { Command, Ctx, InjectBot, Update } from 'nestjs-telegraf';
import { SessionSceneContext } from 'src/bots/bot/core/types/Context';
import { MessageService } from 'src/messages/messages.service';
import { TicketService } from 'src/tickets/tickets.service';
import { UserService } from 'src/users/user/users.service';
import { CallbackQuery } from 'telegraf/typings/core/types/typegram';
import { Pagination } from '@vladislav_zakrevskiy/telegraf-pagination';
import { Telegraf } from 'telegraf';

@Update()
export class SupportUpdate {
  constructor(
    private ticketService: TicketService,
    private userService: UserService,
    private messageService: MessageService,
    @InjectBot() private bot: Telegraf,
  ) {}

  @Command('/tickets')
  async sendTicketList(@Ctx() ctx: SessionSceneContext) {
    const user = await this.userService.getUserByQuery({
      tg_id: ctx.from.id.toString(),
    });
    const tickets = await this.ticketService.getTickets(user.id, {});
    const pagination = new Pagination({
      data: tickets,
      format: ({ created_at }) => `Тикет от ${created_at.toLocaleString()}`,
      header: (currentPage, _, total) => `${currentPage}/${total}`,
      currentPage: 10,
      isEnabledDeleteButton: false,
    });
    pagination.handleActions(this.bot);

    const text = await pagination.text();
    const keyboard = await pagination.keyboard();
    ctx.replyWithHTML(text, keyboard);
  }

  @Command(/ticket (.+)/)
  async chooseTicket(@Ctx() ctx: SessionSceneContext) {
    const ticket_id = (ctx.callbackQuery as CallbackQuery & { data: string }).data.split('_')[1];
    if (ticket_id) {
      await ctx.reply(`Введите айди желаемого для выбора тикета!`);
      return;
    }
    const user = await this.userService.getUserByQuery({
      tg_id: ctx.from.id.toString(),
    });
    if (user.role !== 'SUPPORT') {
      await ctx.reply(`Вы не работник поддержки, эта команда вам недоступна!`);
      return;
    }
    const ticket = await this.ticketService.getTicket(ticket_id);
    if (!ticket) {
      await ctx.reply(`Такого тикета не существует! Проверьте на правильность введенную команду`);
      return;
    }

    ctx.session.current_ticket_id = ticket_id;
    await ctx.reply(`Выбран тикет ${ticket_id}!`);
  }

  @Command('/ticket_messages')
  async getTicketMessages(@Ctx() ctx: SessionSceneContext) {
    const { current_ticket_id } = ctx.session;
    if (!current_ticket_id) {
      await ctx.reply('Не выбран тикет! Выберите его в /tickets либо командой /ticket <ID>');
      return;
    }
    const { messages, user_id } = await this.ticketService.getTicket(current_ticket_id, {
      messages: true,
    });

    if (messages.length === 0) {
      await ctx.reply('Простите, сообщений в этом тикете нет');
      return;
    }

    const tgMessages: string[] = [''];

    for (const message of messages) {
      const lastMessage = tgMessages[tgMessages.length - 1];
      if (lastMessage.length + message.text.length + 20 <= 4000) {
        tgMessages[tgMessages.length - 1] += `
${message.user_id === user_id ? '*Пользователь*' : '*Поддержка*'}
>${message.text}`;
      } else {
        tgMessages.push(`${message.user_id === user_id ? '*Пользователь*' : '*Поддержка*'}
>${message.text}`);
      }
    }

    tgMessages.forEach(async (mes) => await ctx.replyWithMarkdownV2(mes));
  }

  @Command('/close_ticket')
  async closeTicket(@Ctx() ctx: SessionSceneContext) {
    const { current_ticket_id } = ctx.session;
    if (!current_ticket_id) {
      await ctx.reply('Не выбран тикет! Выберите его в /tickets либо командой /ticket <ID>');
      return;
    }
    const user = await this.userService.getUserByQuery({
      tg_id: ctx.from.id.toString(),
    });

    await this.messageService.createMessage({
      sended: false,
      text: 'Оператор предлагает закрыть проблему, согласны?',
      ticket: { connect: { id: current_ticket_id } },
      type: 'CLOSE',
      user: { connect: { id: user.id } },
    });
    await ctx.reply('Отправили пользователю запрос на закрытие тикета! Ожидайsте!');
  }
}
