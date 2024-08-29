import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';
import * as cheerio from 'cheerio';

class LoginService {
  private axiosInstance: AxiosInstance;
  private cookies: string[];

  constructor() {
    this.axiosInstance = axios.create({
      withCredentials: true,
      maxRedirects: 0,
      validateStatus: () => true,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Language': 'fr-FR,fr;q=0.9,en-GB;q=0.8,en;q=0.7,en-US;q=0.6,es;q=0.5',
      },
    });
    this.cookies = [];
  }

  private updateCookies(headers: Record<string, string | string[]>): void {
    if (headers['set-cookie']) {
      const newCookies = Array.isArray(headers['set-cookie']) ? headers['set-cookie'] : [headers['set-cookie']];
      this.cookies = [...this.cookies, ...newCookies];
      this.axiosInstance.defaults.headers.Cookie = this.cookies.join('; ');
    }
  }

  private async makeRequest(method: string, url: string, data: string | null = null, additionalHeaders: Record<string, string> = {}): Promise<AxiosResponse> {
    const config: AxiosRequestConfig = {
      method,
      url,
      headers: {
        ...this.axiosInstance.defaults.headers,
        ...additionalHeaders,
      },
      data,
    };

    if (this.cookies.length > 0) {
      config.headers = config.headers || {};
      config.headers.Cookie = this.cookies.join('; ');
    }

    const response = await this.axiosInstance(config);
    this.updateCookies(response.headers);
    return response;
  }

  async login(username: string, password: string): Promise<boolean> {
    try {
      // Step 1: Initial GET request to /Home/Logon
      let response = await this.makeRequest('GET', 'https://mon-espace.izly.fr/Home/Logon', null, {
        'Referer': 'https://mon-espace.izly.fr/',
      });

      const $ = cheerio.load(response.data);
      const requestVerificationToken = $('input[name="__RequestVerificationToken"]').val() as string;

      // Step 2: POST login request
      response = await this.makeRequest('POST', 'https://mon-espace.izly.fr/Home/Logon',
        `__RequestVerificationToken=${encodeURIComponent(requestVerificationToken)}&ReturnUrl=&Username=${encodeURIComponent(username)}&Password=${encodeURIComponent(password)}`,
        {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Origin': 'https://mon-espace.izly.fr',
          'Referer': 'https://mon-espace.izly.fr/Home/Logon',
        }
      );

      // Check for redirect and follow it
      if (response.status === 302) {
        const redirectUrl = response.headers.location as string;
        response = await this.makeRequest('GET', `https://mon-espace.izly.fr${redirectUrl}`, null, {
          'Referer': 'https://mon-espace.izly.fr/Home/Logon',
        });
      }

      // Step 3: Check if we are logged in
      response = await this.makeRequest('GET', 'https://mon-espace.izly.fr/', null, {
        'Referer': 'https://mon-espace.izly.fr/Home/Logon',
      });

      if (response.status !== 200) {
        throw new Error('Failed to login');
      }

      return true;
    } catch (error) {
      console.error('Login error:', (error as Error).message);
      return false;
    }
  }

  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}

export default LoginService;