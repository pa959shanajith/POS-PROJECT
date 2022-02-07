import axios from "axios";
import storageService from "./storageService";
import {toast} from "react-toastify";

export interface IUnit {
    shopId: string,
    name: string,
    units: number,
    price: number,
    description: string
}

class UnitBackendApiService {
    static API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

    static async createUnit(payload: IUnit) {
        const shopId = storageService.getShopId();
        const employeeId = storageService.getEmployeeId();
        const url = `${this.API_ENDPOINT}/unit`;
        try {
            const response = await axios.post(url, {
                ...payload,
                shopId,
                employeeId,
            });
            return {
                success: true,
                data: response.data,
            }
        } catch (e) {
            return {
                success: false,
                message: e.response?.data?.message || 'Something went wrong while creating the unit!'
            }
        }
    }

    static async fetchAllUnits() {
        const shopId = storageService.getShopId();
        const url = `${this.API_ENDPOINT}/unit/${shopId}`;
        try {
            const response = await axios.get(url);
            return {
                success: true,
                data: response.data,
            }
        } catch (e) {
            return {
                success: false,
                message: e.response?.data?.message || 'Something went wrong while fetching the units'
            }
        }
    }

    static async updateUnit(payload: IUnit) {
        const url = `${this.API_ENDPOINT}/unit`;
        try {
            const response = await axios.put(url, {
                ...payload,
            });
            return {
                success: true,
                data: response.data,
            }
        } catch (e) {
            return {
                success: false,
                message: e.response?.data?.message || 'Something went wrong while updating the unit'
            }
        }
    }

    static async deleteUnit(unitId: string) {
        const url = `${this.API_ENDPOINT}/unit/${unitId}`;
        try {
            const response = await axios.delete(url);
            return {
                success: true,
                data: response.data,
            }
        } catch (e) {
            return {
                success: false,
                message: e.response?.data?.message || 'Something went wrong while deleting the unit'
            }
        }
    }
}

export default UnitBackendApiService;
