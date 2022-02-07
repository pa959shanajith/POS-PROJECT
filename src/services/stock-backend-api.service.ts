import axios from "axios";
import storageService from "./storageService";
import {toast} from "react-toastify";

export interface IStock {
    shopId:string,
    storeId: string,
    date: string,
    materialName: string,
    currentStock: string,
}

class StockBackendApiService {
    static API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

    static async createStock(payload: IStock) {
        const shopId = storageService.getShopId();
        const url = `${this.API_ENDPOINT}/stock`;
        try {
            const response = await axios.post(url, {
                ...payload,
                shopId,
            });
            return response.data;
        } catch (e) {
            toast.error('Something went wrong!');
        }
    }

    static async fetchAllStocks() {
        const shopId = storageService.getShopId();
        const url = `${this.API_ENDPOINT}/stock/${shopId}`;
        try {
            const response = await axios.get(url);
            return {
                success: true,
                data: response.data,
            };
        } catch (e) {
            console.error('Something went wrong!');
            return {
                success: false,
                message: e.response?.data?.message || `Something went wrong!`,
            }
        }
    }

    static async updateStock(payload: any) {
        const shopId = storageService.getShopId();
        const employeeId = storageService.getEmployeeId();
        const url = `${this.API_ENDPOINT}/stock`;
        try {
            const response = await axios.post(url, {
                ...payload,
                price: +payload.price / +payload.newPurchase,
                shopId,
                employeeId,
            });
            return {
                success: true,
                data: response.data,
            };
        } catch (e) {
            console.error('Something went wrong!');
            return {
                success: false,
                message: e.response?.data?.message || `Something went wrong!`,
            }
        }
    }

    static async adjustStock(payload: any) {
        const shopId = storageService.getShopId();
        const employeeId = storageService.getEmployeeId();
        const url = `${this.API_ENDPOINT}/stock/adjust`;
        try {
            const response = await axios.post(url, {
                ...payload,
                shopId,
                employeeId,
            });
            return {
                success: true,
                data: response.data
            };
        } catch (e) {
            return {
                success: false,
                message: e.response?.data?.message || 'Something went wrong while adjusting the stock',
            }
        }
    }

    static async moveStock(payload: IStock) {
        const shopId = storageService.getShopId();
        const employeeId = storageService.getEmployeeId();
        const url = `${this.API_ENDPOINT}/stock/move-stock`;
        try {
            const response = await axios.post(url, {
                ...payload,
                shopId,
                employeeId
            });
            return {
                success: true,
                data: response.data
            };
        } catch (e) {
            return {
                success: false,
                message: e.response?.data?.message || 'Something went wrong while moving the stock',
            }
        }
    }

    static async fetchMaterialPurchaseList(payload: any) {
        const shopId = storageService.getShopId();
        const url = `${this.API_ENDPOINT}/stocklog/purchase`;
        try {
            const response = await axios.post(url, {
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
                message: e.response?.data?.message || 'Something went wrong fetching material purchase records',
            }
        }
    }
    static async fetchStockListDetails(payload: any) {
        const shopId = storageService.getShopId();
        const url = `${this.API_ENDPOINT}/stock/list`;
        try {
            const response = await axios.post(url, {
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
                message: e.response?.data?.message || 'Something went wrong fetching stocks list details!',
            }
        }
    }
}

export default StockBackendApiService;
