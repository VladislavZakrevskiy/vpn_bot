import { escapeMarkdown } from 'src/bots/bot/core/helpers/escapeMarkdown';

export const getSupportText = () =>
  escapeMarkdown(`Привет! Ты работник техподдержки
Введи /help чтобы узнать как ты можешь пользоваться ботом`);
