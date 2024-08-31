import { AxiosInstance } from 'axios';
import { Deposit } from '../types/Deposit';
import { extractDate } from '~/utils/IzlyDate';
import { extractAmount } from '~/utils/IzlyAmount';
import { extractAllListItems, extractTextByClass, stripHtmlTags } from '~/utils/IzlyHTML';

export async function ServiceDeposits(axiosInstance: AxiosInstance): Promise<Deposit[]> {
  const response = await axiosInstance.get('https://mon-espace.izly.fr/Home/GetTopups', {
    headers: {
      'Referer': 'https://mon-espace.izly.fr/',
      'X-Requested-With': 'XMLHttpRequest',
    }
  });

  const htmlContent = response.data;
  const deposits: Deposit[] = [];

  const listItems = extractAllListItems(htmlContent);

  listItems.forEach(item => {
    const typeInfo = extractTextByClass(item, 'operation-type');
    const [type, method] = typeInfo.split(' - ').map(s => s.trim());

    const dateText = extractTextByClass(item, 'oeration-date');
    const date = extractDate(dateText, ' ');

    const amountText = extractTextByClass(item, 'operation-amount');
    const amount = extractAmount(amountText);

    const status = extractTextByClass(item, 'badge');

    deposits.push({ type, method, date, amount, status });
  });

  return deposits;
}