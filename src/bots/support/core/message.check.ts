import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { MessageService } from 'src/messages/messages.service';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { escapeMarkdown } from 'src/bots/bot/core/helpers/escapeMarkdown';
import { getMessageText } from './texts/getMessageText';
import { TicketService } from 'src/tickets/tickets.service';
import * as dayjs from 'dayjs';

@Injectable()
export class MessageCheckService {
  constructor(
    private messageService: MessageService,
    private ticketService: TicketService,
    @InjectBot('support') private bot: Telegraf,
    @InjectBot('support_work') private workBot: Telegraf,
  ) {}

  @Cron(process.env.MESSAGE_CHECK_TIME)
  async sendMessages() {
    const messages = await this.messageService.getMessagesByQuery(
      { sended: false },
      { ticket: { include: { supporter: true, user: true } } },
    );

    for (const message of messages) {
      const sender_id: { type: 'support' | 'user'; id: string; dialog_id: string } = {
        type: message.ticket.user_id === message.user_id ? 'user' : 'support',
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        id: message.ticket.user_id === message.user_id ? message.ticket.supporter.tg_id : message.ticket.user.tg_id,
        dialog_id:
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          message.ticket.user_id === message.user_id ? message.ticket.user.tg_id : message.ticket.supporter.tg_id,
      };
      let current_message_id: string;
      if (message.type === 'TEXT') {
        if (sender_id.type === 'user') {
          try {
            const { message_id } = await this.workBot.telegram.sendMessage(
              sender_id.id,
              getMessageText(message, 'support'),
              {
                parse_mode: 'MarkdownV2',
                reply_markup: {
                  inline_keyboard: [
                    [{ callback_data: 'choose_ticket_' + message.ticket_id, text: 'Выбрать этот тикет' }],
                  ],
                },
              },
            );
            current_message_id = message_id.toString();
          } catch (e) {
            console.log(e);
          }
        } else {
          try {
            const { message_id } = await this.bot.telegram.sendMessage(sender_id.id, getMessageText(message, 'user'), {
              parse_mode: 'MarkdownV2',
            });
            current_message_id = message_id.toString();
          } catch (e) {
            console.log(e);
          }
        }
      } else {
        try {
          const { message_id } = await this.bot.telegram.sendMessage(sender_id.id, escapeMarkdown(`${message.text}`), {
            reply_markup: {
              inline_keyboard: [[{ callback_data: 'close_ticket_' + message.ticket_id, text: 'Вопрос решен ✅' }]],
            },
          });
          current_message_id = message_id.toString();
        } catch (e) {
          console.log(e);
        }
      }
      await this.messageService.updateMessage({ id: message.id }, { message_id: current_message_id });
    }

    await this.messageService.toggleSended(messages.map(({ id }) => id));
  }

  @Cron(process.env.TICKET_CHECK_TIME)
  async ticketCheck() {
    const tickets = await this.ticketService.getAllTickets(
      { status: 'OPEN' },
      { messages: true, supporter: true, user: true },
    );
    for (const ticket of tickets) {
      const created_at = dayjs(ticket.messages[ticket.messages.length - 1].created_at);
      const now = dayjs();
      const diff = created_at.diff(now, 'h');
      if (ticket.messages.length !== 0 && Math.abs(diff) >= 48) {
        await this.bot.telegram.sendMessage(
          ticket.user.tg_id,
          escapeMarkdown(
            'Сообщение на закрытие чата висит больше 48 часов, поэтому мы закрыли его. Если возникнут проблемы, обращайтесь!',
          ),
        );
        await this.workBot.telegram.sendMessage(
          ticket.supporter.tg_id,
          escapeMarkdown(
            `Сообщение на закрытие чата висит больше 48 часов, поэтому мы закрыли его
*Тикет*: \`${ticket.id}\``,
          ),
        );
        this.ticketService.closeTicket(ticket.id);
      }
    }
  }
}
