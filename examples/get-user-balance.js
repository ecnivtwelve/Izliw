const Izly = require('../dist');

void async function main() {
  const izly = new Izly();
  await izly.login('identifiant', 'codeSecret');

  const balance = await izly.getBalance();

  console.log(balance);

  console.log(`Votre solde Izly était de ${balance.amount.toFixed(2)}€ le ${balance.date.toLocaleDateString('fr-FR')}.`);
}();