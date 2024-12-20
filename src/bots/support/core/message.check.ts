import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { MessageService } from 'src/messages/messages.service';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { escapeMarkdown } from 'src/bots/bot/core/helpers/escapeMarkdown';

@Injectable()
export class MessageCheckService {
  constructor(
    private messageService: MessageService,
    @InjectBot('support') private bot: Telegraf,
  ) {}

  @Cron(process.env.MESSAGE_CHECK_TIME)
  async sendMessages() {
    const messages = await this.messageService.getMessagesByQuery(
      { sended: false },
      { ticket: { include: { supporter: true, user: true } } },
    );

    for (const message of messages) {
      const sender_id: { type: 'support' | 'user'; id: string } = {
        type: message.ticket.user_id === message.user_id ? 'user' : 'support',
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        id: message.ticket.user_id === message.user_id ? message.ticket.supporter.tg_id : message.ticket.user.tg_id,
      };
      if (message.type === 'TEXT') {
        await this.bot.telegram.sendMessage(
          sender_id.id,
          `${sender_id.type === 'user' ? '*Сообщение от пользователя, номер тикета:*' + `\`\`\`${message.id}\`\`\`` : '*Сообщение от работника поддержки:*'}
>${message.text}`,
          { parse_mode: 'MarkdownV2' },
        );
      } else {
        await this.bot.telegram.sendMessage(sender_id.id, escapeMarkdown(`${message.text}`), {
          reply_markup: {
            inline_keyboard: [[{ callback_data: 'close_ticket', text: 'Закрыть проблему' }]],
          },
        });
      }
    }

    await this.messageService.toggleSended(messages.map(({ id }) => id));
  }
}
