import axios from "axios";
import storageService from "./storageService";
import {toast} from "react-toastify";

export interface IStore {
    shopId:string,
    name: string,
    description: string,
    isActive: boolean
}

class StoreBackendApiService {
    static API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

    static async createStore(payload: IStore) {
        const shopId = storageService.getShopId();
        const employeeId = storageService.getEmployeeId();
        const url = `${this.API_ENDPOINT}/store`;
        try {
            const response = await axios.post(url, {
                ...payload,
                shopId,
                employeeId,
            });
            return response.data;
        } catch (e) {
            toast.error('Something went wrong!');
        }
    }

    static async fetchAllStore() {
        const shopId = storageService.getShopId();
        const url = `${this.API_ENDPOINT}/store/${shopId}`;
        try {
            const response = await axios.get(url);
            return {
                success: true,
                data: response.data,
            }
        } catch (e) {
            return {
                success: false,
                message: e.response?.data?.message || 'Something went wrong while fetching the stores'
            }
        }
    }

    static async updateStore(payload: IStore) {
        const url = `${this.API_ENDPOINT}/store`;
        try {
            const response = await axios.put(url, {
                ...payload,
            });
            return response.data;
        } catch (e) {
            console.error('Something went wrong!');
        }
    }


    static async deleteStore(storeId: string) {
        const url = `${this.API_ENDPOINT}/store/${storeId}`;
        try {
            const response = await axios.delete(url);
            return {
                success: true,
                data: response.data,
            }
        } catch (e) {
            return {
                success: false,
                message: e.response?.data?.message || 'Something went wrong while deleting the store'
            }
        }
    }

}

export default StoreBackendApiService;
