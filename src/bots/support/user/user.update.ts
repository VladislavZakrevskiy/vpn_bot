import { Action, Ctx, InjectBot, On, Update } from 'nestjs-telegraf';
import { SessionSceneContext } from 'src/bots/bot/core/types/Context';
import { UserService } from '../../../users/user/users.service';
import { Role, Ticket, User } from '@prisma/client';
import { TicketService } from '../../../tickets/tickets.service';
import { MessageService } from '../../../messages/messages.service';
import { Telegraf } from 'telegraf';
import { CallbackQuery } from 'telegraf/typings/core/types/typegram';
import { escapeMarkdown } from 'src/bots/bot/core/helpers/escapeMarkdown';

@Update()
export class UserUpdate {
  constructor(
    private userService: UserService,
    private ticketService: TicketService,
    private messageService: MessageService,
    @InjectBot('support') private readonly bot: Telegraf,
    @InjectBot('support_bot') private readonly workBot: Telegraf,
  ) {}

  @Action(/^close_ticket_(.+)$/)
  async close_ticket(@Ctx() ctx: SessionSceneContext) {
    const ticket_id = (ctx.callbackQuery as CallbackQuery & { data: string }).data.split('_')[2];
    const ticket = await this.ticketService.closeTicket(ticket_id);

    await this.workBot.telegram.sendMessage(
      ticket.supporter.tg_id,
      `Пользователь закрыл тикет\\! ✅
*Тикет от ${escapeMarkdown(ticket.created_at.toLocaleString())}:*
\`${escapeMarkdown(ticket.id)}\`
>${escapeMarkdown(ticket.messages[ticket.messages.length - 1].text)}`,
      { parse_mode: 'MarkdownV2' },
    );
    await ctx.reply('Закрыли проблему! Если снова возникнут трудности, обращайтесь!');

    const lastCloseMessage = ticket.messages.findLast(({ type }) => type === 'CLOSE');
    await this.bot.telegram.deleteMessage(ticket.user_id, Number(lastCloseMessage.message_id));
  }

  @Action(/^close_ticket_fail_(.+)$/)
  async close_fail_ticket(@Ctx() ctx: SessionSceneContext) {
    const ticket_id = (ctx.callbackQuery as CallbackQuery & { data: string }).data.split('_')[2];
    const ticket = await this.ticketService.closeTicket(ticket_id);

    await this.workBot.telegram.sendMessage(
      ticket.supporter.tg_id,
      `Пользователь не закрыл тикет\\! ❌
*Тикет от ${escapeMarkdown(ticket.created_at.toLocaleString())}:*
\`${escapeMarkdown(ticket.id)}\`
>${escapeMarkdown(ticket.messages[ticket.messages.length - 1].text)}`,
      { parse_mode: 'MarkdownV2' },
    );
    await ctx.reply('Продолжаем разбираться\\!');

    const lastCloseMessage = ticket.messages.findLast(({ type }) => type === 'CLOSE');
    await this.bot.telegram.deleteMessage(ticket.user_id, Number(lastCloseMessage.message_id));
  }

  @On('text')
  async onText(@Ctx() ctx: SessionSceneContext) {
    const user = await this.userService.getUserByQuery({
      tg_id: ctx.from.id.toString(),
    });

    switch (user.role) {
      case Role.USER:
      case Role.ADMIN:
        await this.onTextUser(ctx, user);
        break;
    }
  }

  async onTextUser(ctx: SessionSceneContext, user: User) {
    const tickets = await this.ticketService.getTickets(user.id, {
      status: 'OPEN',
    });
    let ticket: Ticket;
    if (tickets.length === 0) {
      ticket = await this.ticketService.addTicket(user.id);
    } else {
      ticket = tickets[0];
    }
    await this.messageService.createMessage({
      sended: false,
      text: ctx.text,
      type: 'TEXT',
      ticket: { connect: { id: ticket.id } },
      user: { connect: { id: user.id } },
    });
    await ctx.reply('Ваше сообщение в обработке! Ожидайте работника службы поддержки');
  }
}
