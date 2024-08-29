import { AxiosInstance } from 'axios';
import * as cheerio from 'cheerio';
import { Balance } from '~/types/Balance';
import { extractAmount } from '~/utils/IzlyAmount';
import { extractDate } from '~/utils/IzlyDate';

export async function ServiceBalance(axiosInstance: AxiosInstance): Promise < Balance > {
  const response = await axiosInstance.get('https://mon-espace.izly.fr/',{
    headers: {
      'Referer': 'https://mon-espace.izly.fr/Home/Logon',
    }
  });

  const $ = cheerio.load(response.data);
  const balanceText = $('#balance').text().trim();
  const balance = extractAmount(balanceText);
  
  const balanceDate = $('.balance-heading-date').text().trim();
  const date = extractDate(balanceDate, ' à ');

  if (isNaN(balance)) {
    throw new Error('Failed to extract balance. Possible page structure change.');
  }

  return {
    date: date,
    amount: balance,
  };
}