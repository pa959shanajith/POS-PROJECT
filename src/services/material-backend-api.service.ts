import axios from "axios";
import storageService from "./storageService";
import {toast} from "react-toastify";

export interface IMaterial {
    shopId: string,
    name: string,
    units: number,
    price: number,
    description: string
}

class MaterialBackendApiService {
    static API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

    static async createMaterial(payload: IMaterial) {
        const shopId = storageService.getShopId();
        const employeeId = storageService.getEmployeeId();
        const url = `${this.API_ENDPOINT}/material`;
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
                message: e.response?.data?.message || 'Something went wrong while creating the material!'
            }
        }
    }

    static async fetchAllMaterials() {
        const shopId = storageService.getShopId();
        const url = `${this.API_ENDPOINT}/material/${shopId}`;
        try {
            const response = await axios.get(url);
            return {
                success: true,
                data: response.data,
            }
        } catch (e) {
            return {
                success: false,
                message: e.response?.data?.message || 'Something went wrong while fetching the materials'
            }
        }
    }

    static async updateMaterial(payload: IMaterial) {
        const url = `${this.API_ENDPOINT}/material`;
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
                message: e.response?.data?.message || 'Something went wrong while updating the material'
            }
        }
    }

    static async deleteMaterial(materialId: string) {
        const url = `${this.API_ENDPOINT}/material/${materialId}`;
        try {
            const response = await axios.delete(url);
            return {
                success: true,
                data: response.data,
            }
        } catch (e) {
            return {
                success: false,
                message: e.response?.data?.message || 'Something went wrong while deleting the material'
            }
        }
    }
}

export default MaterialBackendApiService;
