import { AxiosInstance } from 'axios';
import { Payment } from '../types/Payment';
import { extractDate } from '~/utils/IzlyDate';
import { extractAmount } from '~/utils/IzlyAmount';
import { extractAllListItems, extractTextByClass, stripHtmlTags } from '~/utils/IzlyHTML';

export async function ServicePayments(axiosInstance: AxiosInstance): Promise<Payment[]> {
  const response = await axiosInstance.get('https://mon-espace.izly.fr/Home/GetPayments', {
    headers: {
      'Referer': 'https://mon-espace.izly.fr/',
      'X-Requested-With': 'XMLHttpRequest',
    }
  });

  const htmlContent = response.data;
  const payments: Payment[] = [];

  const listItems = extractAllListItems(htmlContent);

  console.log(listItems);

  listItems.forEach(item => {
    const label = extractTextByClass(item, 'operation-type');

    const dateText = extractTextByClass(item, 'oeration-date');
    const date = extractDate(dateText, ' ');

    const amountText = extractTextByClass(item, 'operation-amount');
    const amount = extractAmount(amountText);

    const status = extractTextByClass(item, 'badge');

    payments.push({ label, date, amount, status });
  });

  return payments;
}