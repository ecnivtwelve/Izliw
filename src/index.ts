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
import { ServicePayments } from './services/Payments';
import { Payment } from './types/Payment';
class Izly {
  private loginService: LoginService;
  private axiosInstance: AxiosInstance;
  private loggedIn: boolean = false;

  constructor() {
    this.loginService = new LoginService();
    this.axiosInstance = this.loginService.getAxiosInstance();
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

  private checkLogin() {
    if (!this.loggedIn) {
      throw new Error('Not logged in. Please login first.');
    }
  }

  async getProfile(): Promise<Profile> {
    this.checkLogin();
    return ServiceProfile(this.axiosInstance);
  }

  async getNotifications(): Promise<Notification[]> {
    this.checkLogin();
    return ServiceNotifications(this.axiosInstance);
  }

  async getBalance(): Promise<Balance> {
    this.checkLogin();
    return ServiceBalance(this.axiosInstance);
  }

  async getDeposits(): Promise<Deposit[]> {
    this.checkLogin();
    return ServiceDeposits(this.axiosInstance);
  }

  async getPayments(): Promise<Payment[]> {
    this.checkLogin();
    return ServicePayments(this.axiosInstance);
  }

  async generateQRCode(): Promise<string[]> {
    this.checkLogin();
    return RequestQRCode(this.axiosInstance);
  }
}

export default Izly;