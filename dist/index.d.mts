interface Deposit {
    type: string;
    method: string;
    date: Date;
    amount: number;
    status: string;
}

interface Notification {
    date: Date;
    description: string;
}

interface Profile {
    name: string;
    identifier: string;
    pseudo: string;
    birthDate: string;
    address: string;
    primaryEmail: string;
    secondaryEmail: string;
    phoneNumber: string;
    companyCode: string;
    tariffCode: string;
    crousRightsEndDate: string;
}

interface Balance {
    date: Date;
    amount: number;
}

declare class Izly {
    private loginService;
    private axiosInstance;
    private loggedIn;
    constructor();
    login(username: string, password: string): Promise<boolean>;
    private checkLogin;
    getProfile(): Promise<Profile>;
    getNotifications(): Promise<Notification[]>;
    getBalance(): Promise<Balance>;
    getDeposits(): Promise<Deposit[]>;
    generateQRCode(): Promise<string[]>;
}

export { Izly as default };
