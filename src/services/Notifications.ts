import { AxiosInstance } from 'axios';
import * as cheerio from 'cheerio';
import { Notification } from '../types/Notification';
import { extractDate } from '~/utils/IzlyDate';

export async function ServiceNotifications(axiosInstance: AxiosInstance): Promise < Notification[] > {
  try {
    const response = await axiosInstance.get('https://mon-espace.izly.fr/Profile?page=1', {
      headers: {
        'Accept': 'text/html, */*; q=0.01',
        'X-Requested-With': 'XMLHttpRequest',
        'Referer': 'https://mon-espace.izly.fr/Profile',
      },
    });

    if (response.status === 200) {
      const $ = cheerio.load(response.data);
      const notifications: Notification[] = [];

      $('.table-responsive .table tr').each((index, element) => {
        const $element = $(element);
        const date = extractDate($element.find('td:nth-child(2)').text().trim(), ' à ');
        const description = $element.find('td:nth-child(3)').text().trim();
        notifications.push({ date, description });
      });

      return notifications;
    } else {
      throw new Error('Failed to retrieve notifications');
    }
  } catch (error) {
    console.error('Error retrieving notifications:', (error as Error).message);
    throw error;
  }
}