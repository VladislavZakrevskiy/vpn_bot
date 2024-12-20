import { Ctx, InjectBot, On, Update } from 'nestjs-telegraf';
import { SessionSceneContext } from 'src/bots/bot/core/types/Context';
import { UserService } from '../../../users/user/users.service';
import { Role, Ticket, User } from '@prisma/client';
import { TicketService } from '../../../tickets/tickets.service';
import { MessageService } from '../../../messages/messages.service';
// import { escapeMarkdown } from 'src/bots/bot/core/helpers/escapeMarkdown';
import { Telegraf } from 'telegraf';

@Update()
export class UserUpdate {
  constructor(
    private userService: UserService,
    private ticketService: TicketService,
    private messageService: MessageService,
    @InjectBot('support') private readonly bot: Telegraf,
  ) {}

  @On('text')
  async onText(@Ctx() ctx: SessionSceneContext) {
    const user = await this.userService.getUserByQuery({
      tg_id: ctx.from.id.toString(),
    });

    switch (user.role) {
      // case Role.SUPPORT:
      //   await this.onTextSupport(ctx, user);
      //   break;
      case Role.USER:
      case Role.ADMIN:
        await this.onTextUser(ctx, user);
        break;
    }
  }

  //   async onTextSupport(ctx: SessionSceneContext, user: User) {
  //     const { current_ticket_id } = ctx.session;
  //     if (!current_ticket_id) {
  //       await ctx.reply(
  //         escapeMarkdown(`Не выбран тикет, сначала выберите его
  // \`\\ticket <id>\``),
  //       );
  //       return;
  //     }
  //     await this.messageService.createMessage({
  //       sended: false,
  //       text: ctx.text,
  //       ticket: { connect: { id: current_ticket_id } },
  //       type: 'TEXT',
  //       user: { connect: { id: user.id } },
  //     });
  //     await ctx.reply(
  //       'Ваше сообщение в обработке! Ожидайте ответа пользователя, вы можете попросить пользователя закрыть тикет с помощью команды \\close_ticket',
  //     );
  //   }

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
