import { Message, Tag, Ticket } from '@prisma/client';
import { escapeMarkdown } from 'src/bots/bot/core/helpers/escapeMarkdown';

export const getMessageText = (message: Message & { ticket: Ticket & { tag: Tag } }, type: 'user' | 'support') => {
  if (type === 'support') {
    return `${`*Сообщение от пользователя, номер тикета:*
\`${message.ticket_id}\``}
>${escapeMarkdown(message.text)}
${message.ticket.tag ? `\`escapeMarkdown(message.ticket.tag.value)\`` : null}`;
  } else {
    return `${'*Сообщение от работника поддержки:*'}
>${escapeMarkdown(message.text)}`;
  }
};
