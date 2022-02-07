import axios from "axios";
import storageService from "./storageService";
import {toast} from "react-toastify";

export interface IPOSSetting {
    name: string;
    logo: any;
    currency: string;
    timeFormat: string;
    enableScanner: boolean;
}

export interface IPOSPrinter {
    name: string;
    description: string;
    ipAddress: string;
}

export interface IPOSTable {
    name: string;
    description: string;
    noOfPerson: string;
}

export interface IAddBillPayload {
    menuItems: Array<any>;
    methodOfPayment:  string; // 'CASH' | 'CARD';
    totalAmount: number;
    orderName: string;
    orderType: string;
    orderMetaData: any;
    voided: boolean;
    notes?: string;
    customerId?: string;
}

export interface IPOSBillTemplate {
    logo: string;
    header: string;
    footer: string;
}

class POSBackendApiService {
    static API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

    static async getBasicSetup() {
        const shopId = storageService.getShopId();
        if (!shopId) {
            return {
                success: false,
                message: 'No shopId found, please login as admin!',
            };
        }
        const url = `${this.API_ENDPOINT}/pos-setup/${shopId}`;
        try {
            const response = await axios.get(url);
            return {
                success: true,
                data: response.data
            };
        } catch (e) {
            return {
                success: false,
                message: e.response?.data?.message || 'Something went wrong while getting the POS basic Data',
            };
        }
    }

    static async basicSetup(payload: any) {
        const url = `${this.API_ENDPOINT}/pos-setup`;
        try {
            const response = await axios.put(url, payload, {
                headers: {
                    contentType: 'multipart/form-data',
                }
            });
            return {
                success: true,
                data: response.data
            };
        } catch (e) {
            return {
                success: false,
                message: e.response?.data?.message || 'Something went wrong while configuring the POS Setup',
            };
        }
    }

    static async addPrinter(payload: IPOSPrinter): Promise<any> {
        const shopId = storageService.getShopId();
        const url = `${this.API_ENDPOINT}/printer`;
        try {
            const response = await axios.post(url, {
                ...payload,
                shopId
            });
            return response.data;
        } catch (e) {
            toast.error('Something went wrong!');
        }
    }

    static async addTable(payload: IPOSTable): Promise<any> {
        const shopId = storageService.getShopId();
        const url = `${this.API_ENDPOINT}/table`;
        try {
            const response = await axios.post(url, {
                ...payload,
                shopId
            });
            return response.data;
        } catch (e) {
            toast.error('Something went wrong adding the table!');
        }
    }

    static async editTable(payload: any): Promise<any> {
        if (!payload.id) {
            toast.error('No Table selected to update!')
        }
        const shopId = storageService.getShopId();
        const url = `${this.API_ENDPOINT}/table`;
        try {
            const response = await axios.put(url, {
                ...payload,
                shopId
            });
            return {
                success: true,
                data: response.data
            };
        } catch (e) {
            return {
                success: false,
                message: e.response?.data?.message || 'Something went wrong while updating the table!'
            };
        }
    }

    static async deleteTable(tableId: string) {
        const url = `${this.API_ENDPOINT}/table/${tableId}`;
        try {
            const response = await axios.delete(url);
            return {
                success: true,
                data: response.data,
            }
        } catch (e) {
            return {
                success: false,
                message: e.response?.data?.message || 'Something went wrong while deleting the table'
            }
        }
    }

    static async fetchAllTables(): Promise<any> {
        const shopId = storageService.getShopId();
        const url = `${this.API_ENDPOINT}/table/${shopId}`;
        try {
            const response = await axios.get(url);
            return {
                success: true,
                data: response.data
            };
        } catch (e) {
            return {
                success: false,
                message: e.response?.data?.message || 'Something went wrong while fetching the tables list!'
            };
        }
    }

    static async addBill(payload : IAddBillPayload): Promise<any> {
        const shopId = storageService.getShopId();
        const employeeId = storageService.getEmployeeId();
        const sessionId = storageService.getSessionId();
        const url = `${this.API_ENDPOINT}/bill`;
        try {
            const response = await axios.post(url, {
                ...payload,
                shopId,
                employeeId,
                sessionId,
            });
            return {
                success: true,
                data: response.data
            };
        } catch (e) {
            toast.error('Something went wrong while adding bill!');
            return {
                success: false,
                data: {}
            };
        }
    }

    static async billTemplate(payload: IPOSBillTemplate): Promise<any> {
        const shopId = storageService.getShopId();
        const url = `${this.API_ENDPOINT}/bill-template`;
        try {
            const response = await axios.post(url, {
                ...payload,
                shopId
            });
            return response.data;
        } catch (e) {
            toast.error('Something went wrong!');
        }
    }

    static async fetchAllBillingItems({startDate, endDate, sessionId, voided}: any): Promise<any> {
        const shopId = storageService.getShopId();
        const url = `${this.API_ENDPOINT}/bill/${shopId}`;
        try {
            const response = await axios.get(url, {
                params: {
                    startDate,
                    endDate,
                    sessionId,
                    voided
                }
            });
            return {
                success: true,
                data: response.data,
            }
        } catch (e) {
            return {
                success: false,
                message: e?.response?.data?.message || 'Something went wrong while fetching billing report!'
            }
        }
    }

    static async addNewCustomer(payload : { name: string, phoneNumber: string, vehicleNumber: string }): Promise<any> {
        const shopId = storageService.getShopId();
        const employeeId = storageService.getEmployeeId();
        const sessionId = storageService.getSessionId();
        const url = `${this.API_ENDPOINT}/customer`;
        try {
            const response = await axios.post(url, {
                ...payload,
                shopId,
                employeeId,
                sessionId,
            });
            return {
                success: true,
                data: response.data
            };
        } catch (e) {
            return {
                success: false,
                message: e.response?.data?.message || 'Something went wrong while adding bill!'
            };
        }
    }

    static async fetchAllCustomers(): Promise<any> {
        const shopId = storageService.getShopId();
        const url = `${this.API_ENDPOINT}/customer/${shopId}`;
        try {
            const response = await axios.get(url );
            return {
                success: true,
                data: response.data,
            }
        } catch (e) {
            return {
                success: false,
                message: e?.response?.data?.message || 'Something went wrong while fetching customers list!'
            }
        }
    }

    static async deleteCustomer(customerId: string) {
        const url = `${this.API_ENDPOINT}/customer/${customerId}`;
        try {
            const response = await axios.delete(url);
            return {
                success: true,
                data: response.data,
            }
        } catch (e) {
            return {
                success: false,
                message: e.response?.data?.message || 'Something went wrong while deleting the customer'
            }
        }
    }
}

export default POSBackendApiService;
