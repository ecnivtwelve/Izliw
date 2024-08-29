const Izly = require('../dist');

void async function main() {
  const izly = new Izly();
  await izly.login('identifiant', 'codeSecret');

  const notifications = await izly.getNotifications();

  console.log(notifications);
}();