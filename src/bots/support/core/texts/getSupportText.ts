import { escapeMarkdown } from 'src/bots/bot/core/helpers/escapeMarkdown';

export const getSupportText = () =>
  escapeMarkdown(`Привет! Ты работник техподдержки
...Какой-то текст...
Введи \\help чтобы узнать как ты можешь пользоваться ботом`);
