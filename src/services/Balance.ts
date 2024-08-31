import { AxiosInstance } from 'axios';
import { Balance } from '~/types/Balance';
import { extractAmount } from '~/utils/IzlyAmount';
import { extractDate } from '~/utils/IzlyDate';
import { extractTextById, extractTextByClass } from '~/utils/IzlyHTML';

export async function ServiceBalance(axiosInstance: AxiosInstance): Promise<Balance> {
  const response = await axiosInstance.get('https://mon-espace.izly.fr/', {
    headers: {
      'Referer': 'https://mon-espace.izly.fr/Home/Logon',
    }
  });

  const htmlContent = response.data;

  const balanceText = extractTextById(htmlContent, 'balance');
  const balance = extractAmount(balanceText);

  const balanceDate = extractTextByClass(htmlContent, 'balance-heading-date');
  const date = extractDate(balanceDate, ' à ');

  if (isNaN(balance)) {
    throw new Error('Failed to extract balance. Possible page structure change.');
  }

  return {
    date: date,
    amount: balance,
  };
}