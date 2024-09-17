const Izly = require('../dist');

void async function main() {
  const izly = new Izly();
  await izly.login('identifiant', 'codeSecret');

  const payments = await izly.getPayments();

  console.log(payments);
}();