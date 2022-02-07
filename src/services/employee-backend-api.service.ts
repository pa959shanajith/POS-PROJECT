import axios from "axios";
import StorageService from './storageService';
import storageService from "./storageService";
import {toast} from "react-toastify";

export interface IEmployeeLogin {
    pin: string;
}

export interface IEmployee {
    name: string;
    email: string;
    mobile: string;
    pin: string; // Missing in Design
    password: string;
    gender: string;
    shopId: string;
    roleId: string; // Need to add dropdown from FE
}

class EmployeeBackendApiService {
    static API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

    static async createEmployee(payload: IEmployee) {
        const url = `${this.API_ENDPOINT}/employee`;
        const shopId = storageService.getShopId();
        try {
            const response = await axios.post(url, {
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
                message: e.response?.data.message || 'Something went wrong creating new employee!!',
            }
        }
    }

    static async fetchAllEmployees() {
        const shopId = storageService.getShopId();
        const url = `${this.API_ENDPOINT}/employee/${shopId}`;
        try {
            const response = await axios.get(url);
            return {
                success: true,
                data: response.data
            };
        } catch (e) {
            return {
                success: false,
                message: e.response?.data.message || 'Something went wrong while fetching all employees!',
            }
        }
    }

    static async updateEmployee(payload: IEmployee) {
        const url = `${this.API_ENDPOINT}/employee`;
        const shopId = storageService.getShopId();
        try {
            const response = await axios.put(url, {
                ...payload,
                shopId,
            });
            return {
                success: true,
                data: response.data
            };
        } catch (e) {
            return {
                success: false,
                message: e.response?.data.message || 'Something went wrong!',
            };
        }
    }

    static async deleteEmployee(employeeId: string) {
        const url = `${this.API_ENDPOINT}/employee/${employeeId}`;
        try {
            const response = await axios.delete(url);
            return {
                success: true,
                data: response.data
            };
        } catch (e) {
            return {
                success: false,
                message: e.response?.data.message || 'Something went wrong!',
            }
        }
    }
}

export default EmployeeBackendApiService;
