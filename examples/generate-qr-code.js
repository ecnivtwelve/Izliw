const Izly = require('../dist');

void async function main() {
  const izly = new Izly();
  await izly.login('identifiant', 'codeSecret');

  const QRCode = await izly.generateQRCode();

  // Returns an array of base64 encoded images
  console.log(QRCode);
}();