import axios from "axios";
import StorageService from './storageService';
import storageService from './storageService';

export interface ILoginPayload {
    email: string;
    password: string;
}

export interface ICreateShop {
    name: string;
    email: string;
    password: string;
}

class ShopBackendApiService {
    static API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;
    static async getShopDetails() {
        const shopId = storageService.getShopId();
        if (!shopId) {
            return {
                success: false,
                message: 'No shopId found, please login as admin!',
            };
        }
        try {
            const url = `${this.API_ENDPOINT}/shop/${shopId} `;
            const token = StorageService.getToken();
            const response = await axios.get(url, {
                headers: {
                    authorization: token,
                }
            });
            return {
                success: true,
                data: response.data,
            };

        } catch (e) {
            // toast.error(e.message);
            return {
                success: false,
                message: e.response?.data?.message || 'Something went wrong while getting shop details!',
            }
        }
    }

    static async fetchAllShops() {
        const url = `${this.API_ENDPOINT}/shop`;
        try {
            const response = await axios.get(url);
            return response.data;
        } catch (e) {
            console.error('Something went wrong!');
        }
    }

    static async createShop(payload: ICreateShop) {
        const url = `${this.API_ENDPOINT}/shop`;
        try {
            const response = await axios.post(url, {
                ...payload,
            });
            return response.data;
        } catch (e) {
            console.error('Something went wrong!');
        }
    }
}

export default ShopBackendApiService;
