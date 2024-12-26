import { Message } from '@prisma/client';
import { escapeMarkdown } from 'src/bots/bot/core/helpers/escapeMarkdown';

export const getMessageText = (message: Message, type: 'user' | 'support') => {
  if (type === 'support') {
    return `${`*Сообщение от пользователя, номер тикета:*
\`${message.ticket_id}\``}
>${escapeMarkdown(message.text)}`;
  } else {
    return `${'*Сообщение от работника поддержки:*'}
>${escapeMarkdown(message.text)}`;
  }
};
