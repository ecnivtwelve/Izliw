import { AxiosInstance } from 'axios';
import * as cheerio from 'cheerio';
import { Profile } from '../types/Profile';

export async function ServiceProfile(axiosInstance: AxiosInstance): Promise<Profile> {
  try {
    const response = await axiosInstance.get('https://mon-espace.izly.fr/Profile', {
      headers: {
        'Referer': 'https://mon-espace.izly.fr/',
      },
    });

    if (response.status === 200) {
      const $ = cheerio.load(response.data);

      const profile: Profile = {
        name: $('h1').first().text().trim(),
        identifier: $('.heading-label-value').eq(0).text().trim(),
        pseudo: $('.heading-label-value').eq(1).text().trim(),
        birthDate: $('.heading-label-value').eq(2).text().trim(),
        address: $('.addWay').text().trim() + ', ' + $('.addZipCode').text().trim() + ' ' + $('.addCity').text().trim(),
        primaryEmail: $('.rectangle').eq(1).text().trim(),
        secondaryEmail: $('#emailPersonnel').text().trim(),
        phoneNumber: $('#currentPhoneNumber').text().trim(),
        companyCode: $('.rectangle').eq(4).text().trim(),
        tariffCode: $('.rectangle').eq(5).text().trim(),
        crousRightsEndDate: $('.rectangle').eq(6).text().trim()
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