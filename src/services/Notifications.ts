import { AxiosInstance } from 'axios';
import { Notification } from '../types/Notification';
import { extractDate } from '~/utils/IzlyDate';
import { extractTableRows, extractTableColumns } from '~/utils/IzlyHTML';

export async function ServiceNotifications(axiosInstance: AxiosInstance): Promise<Notification[]> {
  try {
    const response = await axiosInstance.get('https://mon-espace.izly.fr/Profile?page=1', {
      headers: {
        'Accept': 'text/html, */*; q=0.01',
        'X-Requested-With': 'XMLHttpRequest',
        'Referer': 'https://mon-espace.izly.fr/Profile',
      },
    });

    if (response.status === 200) {
      const htmlContent = response.data;
      const notifications: Notification[] = [];

      const rows = extractTableRows(htmlContent);

      rows.forEach(row => {
        const columns = extractTableColumns(row);
        if (columns.length >= 3) {
          const date = extractDate(columns[1], ' à ');
          const description = columns[2];
          notifications.push({ date, description });
        }
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