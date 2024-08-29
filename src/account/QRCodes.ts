import { AxiosInstance } from 'axios';

export async function RequestQRCode(axiosInstance: AxiosInstance, numberOfQRCodes: number = 1): Promise < string[] > {
  try {
    const response = await axiosInstance.post('https://mon-espace.izly.fr/Home/CreateQrCodeImg',
      `numberOfQrCodes=${numberOfQRCodes}`,
      {
        headers: {
          'Accept': 'text/html, */*; q=0.01',
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'Origin': 'https://mon-espace.izly.fr',
          'Referer': 'https://mon-espace.izly.fr/Home/GenerateQRCode',
        }
      }
    );

    if (response.status === 200) {
      return response.data as string[];  // This should be an array of base64-encoded QR code images
    } else {
      throw new Error('Failed to generate QR Code(s)');
    }
  } catch (error) {
    console.error('Error generating QR Code(s):', (error as Error).message);
    throw error;
  }
}