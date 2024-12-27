import { Message, Tag, Ticket, User } from '@prisma/client';
import { escapeMarkdown } from 'src/bots/bot/core/helpers/escapeMarkdown';

export const getMessageText = (
  message: Message & { ticket: Ticket & { tag: Tag }; user: User },
  type: 'user' | 'support',
) => {
  if (type === 'support') {
    return `${`*Сообщение от пользователя \`${message?.user?.name}\`, номер тикета:*
\`${message.ticket_id}\``}
>${escapeMarkdown(message.text)}
\`${escapeMarkdown(message.ticket?.tag?.value || 'Нет тега')}\``;
  } else {
    return `${'*Сообщение от работника поддержки:*'}
>${escapeMarkdown(message.text)}`;
  }
};
