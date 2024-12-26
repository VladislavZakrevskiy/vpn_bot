import { bold } from './helpers';

export const getHelpText = () => `${bold('Подсказки:')}
/tickets - посмотреть все открытые тикеты, тут же можно выбрать тикет
/ticket <i>ID</i> - выбрать тикет с помощью ID

${bold('Обязательно с выбранным ID токена:')}
/my_ticket - посмотреть, какой тикет выбран
/history - посмотреть историю сообщений тикета
/close_ticket - отправить пользователю заявку на закрытие тикета
`;
