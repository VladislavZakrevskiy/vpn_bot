import { escapeMarkdown } from '../helpers/escapeMarkdown';

export const getSuccessfulPayload = (link: string) =>
  escapeMarkdown(`*Спасибо за покупку CareVPN! 🌐*

Теперь вы можете безопасно подключаться к интернету и защищать свои данные. Для начала работы выполните следующие шаги:

*1. Скачайте и установите приложение Hiddify на ваше устройство:*

📱 [iOS](https://apps.apple.com/us/app/hiddify-proxy-vpn/id6596777532?platform=iphone)
🤖 [Android](https://play.google.com/store/apps/details?id=app.hiddify.com&hl=ru)
💻 [MacOS](https://apps.apple.com/us/app/hiddify-proxy-vpn/id6596777532?platform=iphone)
🖥️ [Windows](https://github.com/hiddify/hiddify-app/releases/latest/download/Hiddify-Windows-Setup-x64.Msix)
💾 [Linux](https://github.com/hiddify/hiddify-app/releases/latest/download/Hiddify-Linux-x64.AppImage)

*2. Запустите клиент Hiddify на вашем устройстве.*

*3. Скопируйте ключ доступа, нажмите на "+" вправом верхнем углу и нажмите "Добавить из буфера обмена".*

*Ваш ключ доступа:*

\`\`\`
${link}
\`\`\`
*Важно:* 
Убедитесь, что ваше подключение к интернету активно.
Если возникнут вопросы или проблемы, не стесняйтесь обращаться к нашей поддержке.
Теперь вы готовы к безопасному серфингу в интернете! 🌍💻

*С уважением,*
*VPN*`);
