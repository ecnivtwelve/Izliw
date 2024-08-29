const Izly = require('../dist');

void async function main() {
  const izly = new Izly();
  await izly.login('identifiant', 'codeSecret');

  const deposits = await izly.getDeposits();

  console.log(deposits);

  for (const deposit of deposits) {
    console.log(`Vous avez effectué un ${deposit.type.toLowerCase()} de ${deposit.amount}€ par ${deposit.method.toLowerCase()} le ${deposit.date.toLocaleDateString('fr-FR')}.`);
  }
}();