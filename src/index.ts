import { AxiosInstance } from 'axios';

import type { Deposit } from './types/Deposit';
import type { Notification } from './types/Notification';
import type { Profile } from './types/Profile';

import { ServiceBalance } from './services/Balance';
import { ServiceDeposits } from './services/Deposits';
import { ServiceNotifications } from './services/Notifications';
import { ServiceProfile } from './services/Profile';

import { RequestQRCode } from './account/QRCodes';
import LoginService from './api/Authentification';
import { Balance } from './types/Balance';

class Izly {
  private loginService: LoginService;
  private axiosInstance: AxiosInstance;
  private loggedIn: boolean;

  constructor() {
    this.loginService = new LoginService();
    this.axiosInstance = this.loginService.getAxiosInstance();
    this.loggedIn = false;
  }

  async login(username: string, password: string): Promise<boolean> {
    try {
      this.loggedIn = await this.loginService.login(username, password);
      return this.loggedIn;
    } catch (error) {
      console.error('Login error:', (error as Error).message);
      return false;
    }
  }

  async getProfile(): Promise<Profile> {
    if (!this.loggedIn) {
      throw new Error('Not logged in. Please login first.');
    }

    return ServiceProfile(this.axiosInstance);
  }

  async getNotifications(): Promise<Notification[]> {
    if (!this.loggedIn) {
      throw new Error('Not logged in. Please login first.');
    }

    return ServiceNotifications(this.axiosInstance);
  }

  async getBalance(): Promise<Balance> {
    if (!this.loggedIn) {
      throw new Error('Not logged in. Please login first.');
    }

    return ServiceBalance(this.axiosInstance);
  }

  async getDeposits(): Promise<Deposit[]> {
    if (!this.loggedIn) {
      throw new Error('Not logged in. Please login first.');
    }

    return ServiceDeposits(this.axiosInstance);
  }

  async generateQRCode(): Promise<string[]> {
    if (!this.loggedIn) {
      throw new Error('Not logged in. Please login first.');
    }

    return RequestQRCode(this.axiosInstance);
  }
}

export default Izly;