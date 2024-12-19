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
    @InjectBot() private bot: Telegraf,
  ) {}

  @Cron(process.env.MESSAGE_CHECK_TIME)
  async sendMessages() {
    const messages = await this.messageService.getMessagesByQuery(
      { sended: false },
      { ticket: true },
    );

    for (const message of messages) {
      const sender_id: { type: 'support' | 'user'; id: string } = {
        type: message.ticket.user_id === message.user_id ? 'user' : 'support',
        id:
          message.ticket.user_id === message.user_id
            ? message.ticket.supporter_id
            : message.ticket.user_id,
      };
      await this.bot.telegram.sendMessage(
        sender_id.id,
        escapeMarkdown(`${sender_id.type === 'support' ? '*Сообщение от пользователя, тикет:*' + '`message.id`' : '*Сообщение от работника поддержки:*'}
${message.text}`),
      );
    }

    await this.messageService.toggleSended(messages.map(({ id }) => id));
  }
}
