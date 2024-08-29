const Izly = require('../dist');

void async function main() {
  const izly = new Izly();
  await izly.login('identifiant', 'codeSecret');

  const profile = await izly.getProfile();

  console.log(profile);
  
  console.log(`Vous êtes ${profile.name} et vous êtes né le ${profile.birthDate}. Vous résidez à ${profile.address}.`);
}();