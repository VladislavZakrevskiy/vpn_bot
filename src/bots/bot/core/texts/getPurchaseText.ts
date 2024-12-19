import { Purchase, Rate } from '@prisma/client';

export const generatePurchaseCardEntities = (
  purchase: Purchase & { rate: Rate },
) => {
  const bold = (text: string) => `<b>${text}</b>`; // Жирный текст
  const italic = (text: string) => `<i>${text}</i>`; // Курсив

  return `💳 ${bold('Покупка тарифа')} 💳

📶 ${bold('Тариф:')} ${purchase.rate?.name || 'Не указан'} (${purchase.rate?.description || purchase.rate.id || 'Не указан'})
💰 ${bold('Стоимость:')} ${purchase.amount} ${purchase.currency}
📅 ${bold('Дата покупки:')} ${purchase.purchase_date.toLocaleString()}
✅ ${bold('Статус:')} ${purchase.active ? 'Активен' : 'Неактивен'}
${
  purchase.vpn_token
    ? `
🔐 ${bold('VPN Токен:')}
${purchase.vpn_token}

${italic('Сохраните этот токен, он понадобится для настройки VPN.')}`
    : ''
}
`;
};
