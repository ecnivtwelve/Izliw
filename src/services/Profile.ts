import { AxiosInstance } from 'axios';
import { Profile } from '../types/Profile';
import { extractTextBetweenTags, extractTextByClass, extractTextById } from '~/utils/IzlyHTML';

export async function ServiceProfile(axiosInstance: AxiosInstance): Promise<Profile> {
  try {
    const response = await axiosInstance.get('https://mon-espace.izly.fr/Profile', {
      headers: {
        'Referer': 'https://mon-espace.izly.fr/',
      },
    });

    if (response.status === 200) {
      const htmlContent = response.data;

      const profile: Profile = {
        name: extractTextBetweenTags(htmlContent, 'h1'),
        identifier: extractTextByClass(htmlContent, 'heading-label-value', 0),
        pseudo: extractTextByClass(htmlContent, 'heading-label-value', 1),
        birthDate: extractTextByClass(htmlContent, 'heading-label-value', 2),
        address: `${extractTextByClass(htmlContent, 'addWay')}, ${extractTextByClass(htmlContent, 'addZipCode')} ${extractTextByClass(htmlContent, 'addCity')}`,
        primaryEmail: extractTextByClass(htmlContent, 'rectangle', 1),
        secondaryEmail: extractTextById(htmlContent, 'emailPersonnel'),
        phoneNumber: extractTextById(htmlContent, 'currentPhoneNumber'),
        companyCode: extractTextByClass(htmlContent, 'rectangle', 4),
        tariffCode: extractTextByClass(htmlContent, 'rectangle', 5),
        crousRightsEndDate: extractTextByClass(htmlContent, 'rectangle', 6)
      };

      return profile;
    } else {
      throw new Error('Failed to retrieve profile information');
    }
  } catch (error) {
    console.error('Error retrieving profile information:', (error as Error).message);
    throw error;
  }
}