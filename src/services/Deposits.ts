import { AxiosInstance } from 'axios';
import * as cheerio from 'cheerio';
import { Deposit } from '../types/Deposit';
import { extractDate } from '~/utils/IzlyDate';
import { extractAmount } from '~/utils/IzlyAmount';

export async function ServiceDeposits(axiosInstance: AxiosInstance): Promise < Deposit[] > {
  const response = await axiosInstance.get('https://mon-espace.izly.fr/Home/GetTopups', {
    headers: {
      'Referer': 'https://mon-espace.izly.fr/',
      'X-Requested-With': 'XMLHttpRequest',
    }
  });

  const deposits: Deposit[] = [];
  const $ = cheerio.load(response.data);
  $('.list-group-item').each((index, element) => {
    const $element = $(element);
    const type = $element.find('.operation-type').text().split(' - ')[0]?.trim();
    const method = $element.find('.operation-type').text().split(' - ')[1]?.trim();
    const date = extractDate($element.find('.oeration-date').text().trim(), ' ');
    const amount = extractAmount($element.find('.operation-amount').text().trim());
    const status = $element.find('.badge').text().trim();
    deposits.push({ type, method, date, amount, status });
  });

  return deposits;
}