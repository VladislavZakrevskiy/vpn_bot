import { User } from '@prisma/client';
import { escapeMarkdown } from '../helpers/escapeMarkdown';

export const getProfile = (user: User) =>
  escapeMarkdown(`👤 *Ваш профиль:*

🔒 Статус: ${user.is_active ? 'Активен ✅' : 'Неактивен ❌'}
🎁 Пробный период: ${user.was_trial ? 'Был ✅' : 'Не был ❌'}
${user.vpn_token ? '🔑 VPN Токен: ' + user.vpn_token : ''}
`);
