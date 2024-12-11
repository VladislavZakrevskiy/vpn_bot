import { escapeMarkdown } from '../helpers/escapeMarkdown';
export const getCryptoPaymentText = (amount: number, currency: string) =>
  escapeMarkdown(`✅ Счет на оплату CryptoBot создан, нажмите *'Перейти к оплате'* и оплатите товар.
Сумма к оплате: ${amount} ${currency}

После оплаты бот автоматически выдаст вам товар.`);
