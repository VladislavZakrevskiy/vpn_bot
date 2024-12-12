export const getSuccessfulPayload = (
  link: string,
) => `<b>Спасибо за покупку CareVPN!</b> 🌐

Теперь вы можете безопасно подключаться к интернету и защищать свои данные. Для начала работы выполните следующие шаги:

<b>1. Скачайте и установите приложение Hiddify на ваше устройство:</b>

📱 <a href="https://apps.apple.com/us/app/hiddify-proxy-vpn/id6596777532?platform=iphone">iOS</a>
🤖 <a href="https://play.google.com/store/apps/details?id=app.hiddify.com&hl=ru">Android</a>
💻 <a href="https://apps.apple.com/us/app/hiddify-proxy-vpn/id6596777532?platform=iphone">MacOS</a>
🖥️ <a href="https://github.com/hiddify/hiddify-app/releases/latest/download/Hiddify-Windows-Setup-x64.Msix">Windows</a>
💾 <a href="https://github.com/hiddify/hiddify-app/releases/latest/download/Hiddify-Linux-x64.AppImage">Linux</a>

<b>2. Запустите клиент Hiddify на вашем устройстве.</b>

<b>3. Скопируйте ключ доступа, нажмите на "+" вправом верхнем углу и нажмите "Добавить из буфера обмена".</b>

<b>Ваш ключ доступа:</b>
<pre>
${link}
</pre>
<b>Важно:</b> 
Убедитесь, что ваше подключение к интернету активно.
Если возникнут вопросы или проблемы, не стесняйтесь обращаться к нашей поддержке.
Теперь вы готовы к безопасному серфингу в интернете! 🌍💻

<b>С уважением,</b>
<b>VPN</b>`;
