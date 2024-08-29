import { AxiosInstance } from 'axios';
import { Deposit, Notification, Profile, Balance } from './types';
import { ServiceBalance, ServiceDeposits, ServiceNotifications, ServiceProfile } from './services';
import { RequestQRCode } from './account/QRCodes';
import LoginService from './api/Authentification';

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

  async generateQRCode(): Promise<string[]> {
    this.checkLogin();
    return RequestQRCode(this.axiosInstance);
  }
}

export default Izly;