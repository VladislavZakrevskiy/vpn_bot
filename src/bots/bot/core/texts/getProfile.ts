import { User } from '@prisma/client';
import { escapeMarkdown } from '../helpers/escapeMarkdown';
import { Dayjs } from 'dayjs';

export const getProfile = (user: User, lastDay?: Dayjs, lastGb?: string) =>
  escapeMarkdown(`👤 *Ваш профиль:*

🔒 Статус: ${user.is_active ? 'Активен ✅' : 'Неактивен ❌'}
🎁 Пробный период: ${user.was_trial ? 'Был ✅' : 'Не был ❌'}
${lastDay ? '🕛 Дата конца тарифа: ' + lastDay.toISOString().split('T')[0] : ''}
${lastGb ? '👨‍💻 Осталось гигайбайт: ' + lastGb + 'ГБ' : ''}
`);
