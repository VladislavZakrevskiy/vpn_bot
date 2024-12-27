import { Action, Command, Ctx, InjectBot, On, Update } from 'nestjs-telegraf';
import { SessionSceneContext } from 'src/bots/bot/core/types/Context';
import { MessageService } from 'src/messages/messages.service';
import { TicketService } from 'src/tickets/tickets.service';
import { UserService } from 'src/users/user/users.service';
import { Pagination } from '@vladislav_zakrevskiy/telegraf-pagination';
import { Telegraf } from 'telegraf';
import { escapeMarkdown } from 'src/bots/bot/core/helpers/escapeMarkdown';
import { PrismaService } from 'src/db/prisma.service';
import { CallbackQuery } from 'telegraf/typings/core/types/typegram';

@Update()
export class SupportUpdate {
  constructor(
    private ticketService: TicketService,
    private userService: UserService,
    private messageService: MessageService,
    private prisma: PrismaService,
    @InjectBot('support') private bot: Telegraf,
  ) {}

  @Action(/^tag_(.+)$/)
  async choose_tag(@Ctx() ctx: SessionSceneContext) {
    const ticket_id = (ctx.callbackQuery as CallbackQuery & { data: string }).data.split('_')[1];
    const tag_id = (ctx.callbackQuery as CallbackQuery & { data: string }).data.split('_')[2];

    const ticket = await this.ticketService.getTicket(ticket_id, { tag: true }, 'OPEN');
    const tag = await this.prisma.tag.findUnique({ where: { id: Number(tag_id) } });
    if (!ticket) {
      await ctx.reply(`Такого тикета не существует! Проверьте на правильность введенную команду`);
      return;
    }
    if (!tag) {
      await ctx.reply('Такого тега не существует');
      return;
    }
    await this.ticketService.setTagToTicket(ticket_id, Number(tag_id));
    await ctx.reply('Выбран тег для тикета!');
  }

  @Action(/^choose_ticket_(.+)$/)
  async choose_ticket(@Ctx() ctx: SessionSceneContext) {
    const ticket_id = (ctx.callbackQuery as CallbackQuery & { data: string }).data.split('_')[2];

    if (!ticket_id) {
      await ctx.reply(`Введите айди желаемого для выбора тикета!`);
      return;
    }

    const ticket = await this.ticketService.getTicket(ticket_id, { tag: true }, 'OPEN');
    if (!ticket) {
      await ctx.reply(`Такого тикета не существует! Проверьте на правильность введенную команду`);
      return;
    }

    ctx.session.current_ticket_id = ticket_id;
    await ctx.replyWithMarkdownV2(
      escapeMarkdown(`Выбран тикет! 
*Тикет от ${ticket.created_at.toLocaleString()}:* 
\`${ticket.id}\`
\`${escapeMarkdown(ticket.tag?.value || 'Нет тега')}\``),
    );
  }

  @Action(/^delete_message_(.+)$/)
  async deleteMessage(@Ctx() ctx: SessionSceneContext) {
    const id = (ctx.callbackQuery as CallbackQuery & { data: string }).data.split('_')[2];

    try {
      const message = await this.messageService.getMessageByQuery({ id }, { ticket: { include: { user: true } } });
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      await this.bot.telegram.deleteMessage(message.ticket.user.tg_id, Number(message.message_id));
      await ctx.replyWithMarkdownV2(`Сообщение удалено
>${escapeMarkdown(message.text)}`);
    } catch (e) {
      await ctx.replyWithMarkdownV2('Произошла ошибка удаления, попробуйте снова через минуту');
      console.log(e);
    }
  }

  @Command('my_ticket')
  async sendTicket(@Ctx() ctx: SessionSceneContext) {
    const user = await this.userService.getUserByQuery({ tg_id: ctx.from.id.toString() });
    if (user.role !== 'SUPPORT') {
      return;
    }

    const { current_ticket_id } = ctx.session;
    if (!current_ticket_id) [await ctx.reply('Тикет не выбран')];
    const { created_at, messages, id, tag } = await this.ticketService.getTicket(
      current_ticket_id,
      {
        tag: true,
        messages: { take: 1 },
      },
      'OPEN',
    );

    await ctx.replyWithMarkdownV2(`*Тикет от ${escapeMarkdown(created_at.toLocaleString())}*
\`${escapeMarkdown(id)}\`
>${escapeMarkdown(messages[messages.length - 1]?.text || '')}
\`${escapeMarkdown(tag?.value || 'Нет тега')}\``);
  }

  @Command('tickets')
  async sendTicketList(@Ctx() ctx: SessionSceneContext) {
    const user = await this.userService.getUserByQuery({ tg_id: ctx.from.id.toString() });
    if (user.role !== 'SUPPORT') {
      return;
    }

    const tickets = await this.ticketService.getTickets(
      user.id,
      { status: 'OPEN' },
      { messages: { take: 1 }, tag: true },
    );

    const pagination = new Pagination({
      data: tickets,
      format: (
        { created_at, id, messages, tag },
        index,
      ) => `*${index + 1}\\. Тикет от ${escapeMarkdown(created_at.toLocaleString())}*
\`${escapeMarkdown(id)}\`
>${escapeMarkdown(messages[messages.length - 1]?.text || '')}
\`${escapeMarkdown(tag?.value || 'Нет тега')}\``,
      onSelect: async ({ id, created_at }) => {
        ctx.session.current_ticket_id = id;
        await ctx.replyWithMarkdownV2(
          escapeMarkdown(`Выбран тикет! 
*Тикет от ${created_at.toLocaleString()}:* \`${id}\``),
        );
      },
      rowSize: 5,
      header: (currentPage, pageSize, total) =>
        `${currentPage}/${Math.ceil(total / pageSize)} страница открытых тикетов`,
      pageSize: 4,
      isEnabledDeleteButton: false,
      parse_mode: 'MarkdownV2',
    });
    pagination.handleActions(this.bot);

    const text = await pagination.text();
    const keyboard = await pagination.keyboard();
    ctx.replyWithMarkdownV2(text, keyboard);
  }

  @Command('ticket')
  async chooseTicket(@Ctx() ctx: SessionSceneContext) {
    const user = await this.userService.getUserByQuery({
      tg_id: ctx.from.id.toString(),
    });
    if (user.role !== 'SUPPORT') {
      return;
    }
    const ticket_id = ctx.text.split(' ')[1];
    if (!ticket_id) {
      await ctx.reply(`Введите айди желаемого для выбора тикета!`);
      return;
    }

    const ticket = await this.ticketService.getTicket(ticket_id, { tag: true }, 'OPEN');
    if (!ticket) {
      await ctx.reply(`Такого тикета не существует! Проверьте на правильность введенную команду`);
      return;
    }

    ctx.session.current_ticket_id = ticket_id;
    await ctx.replyWithMarkdownV2(
      escapeMarkdown(`Выбран тикет! 
*Тикет от ${ticket.created_at.toLocaleString()}:* 
\`${ticket.id}\`
\`${escapeMarkdown(ticket.tag?.value || 'Нет тега')}\``),
    );
  }

  @Command('history')
  async getTicketMessages(@Ctx() ctx: SessionSceneContext) {
    const user = await this.userService.getUserByQuery({ tg_id: ctx.from.id.toString() });
    if (user.role !== 'SUPPORT') {
      return;
    }

    const { current_ticket_id } = ctx.session;
    if (!current_ticket_id) {
      await ctx.reply('Не выбран тикет! Выберите его в /tickets либо командой /ticket <ID>');
      return;
    }

    const { messages, supporter_id } = await this.ticketService.getTicket(
      current_ticket_id,
      {
        messages: true,
      },
      'OPEN',
    );

    if (messages.length === 0) {
      await ctx.reply('Простите, сообщений в этом тикете нет');
      return;
    }

    const pagination = new Pagination({
      data: messages,
      onlyNavButtons: true,
      format: ({ text, user_id }) => `*${user_id === supporter_id ? 'Вы' : 'Пользователь'}*
      >${escapeMarkdown(text)}`,
      parse_mode: 'MarkdownV2',
      header: (currentPage, size, total) => `${currentPage}/${Math.ceil(total / size)}`,
      isEnabledDeleteButton: false,
    });

    pagination.handleActions(this.bot);
    const text = await pagination.text();
    const keyboard = await pagination.keyboard();
    await ctx.replyWithMarkdownV2(text, keyboard);
  }

  @Command('close_ticket')
  async closeTicket(@Ctx() ctx: SessionSceneContext) {
    const user = await this.userService.getUserByQuery({ tg_id: ctx.from.id.toString() });
    if (user.role !== 'SUPPORT') {
      return;
    }

    const { current_ticket_id } = ctx.session;
    if (!current_ticket_id) {
      await ctx.reply('Не выбран тикет! Выберите его в /tickets либо командой /ticket <ID>');
      return;
    }

    const settings = await this.prisma.settings.findFirst();
    await this.messageService.createMessage({
      sended: false,
      text: settings.tp_close_user_message,
      // Оператор предлагает закрыть проблему, согласны?
      ticket: { connect: { id: current_ticket_id } },
      type: 'CLOSE',
      user: { connect: { id: user.id } },
    });
    await ctx.reply(settings.tp_close_support_message);
    // 'Отправили пользователю запрос на закрытие тикета! Ожидайsте!'
  }

  @On('text')
  async sendMessage(@Ctx() ctx: SessionSceneContext) {
    const user = await this.userService.getUserByQuery({ tg_id: ctx.from.id.toString() });
    if (user.role !== 'SUPPORT') {
      return;
    }

    const messageText = ctx.text;
    const current_ticket_id = ctx.session.current_ticket_id;

    if (!current_ticket_id) {
      await ctx.reply('Не выбран тикет! Сначала выберите, потом пишите сообщение');
      return;
    }

    if (!messageText) {
      await ctx.reply('Введите какой-нибудь текст в сообщение!');
      return;
    }
    const ticket = await this.ticketService.getTicket(current_ticket_id, { tag: true }, 'OPEN');
    const { id } = await this.messageService.createMessage({
      sended: false,
      text: messageText,
      type: 'TEXT',
      ticket: { connect: { id: current_ticket_id } },
      user: { connect: { tg_id: ctx.from.id.toString() } },
    });
    await ctx.replyWithMarkdownV2(
      `Сообщение отправлено на
*Тикет от ${escapeMarkdown(ticket.created_at.toLocaleString())}:*
\`${escapeMarkdown(ticket.id)}\`
\>${escapeMarkdown(messageText)}
\`${escapeMarkdown(ticket.tag?.value || 'Нет тега')}\``,
      {
        reply_markup: { inline_keyboard: [[{ callback_data: 'delete_message_' + id, text: 'Удалить это сообщение' }]] },
      },
    );
  }
}
