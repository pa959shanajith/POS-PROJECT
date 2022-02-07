import axios from "axios";
import storageService from "./storageService";

export interface IRoleData {
    name: string,
    shopId: string,
    editEmployee: boolean,
    viewEmployee: boolean,
    editMaterial: boolean,
    viewMaterial: boolean,
    editMenuItem: boolean,
    viewMenuItem: boolean,
    editPOSSettings: boolean,
    viewPOSSettings: boolean,
    viewReports: boolean,
    editSession: boolean,
    addBill: boolean,
    deleteBill: boolean,
    accessSettings: boolean,
    minimizePOS: boolean,
    editInventory: boolean,
    viewInventory: boolean,
    editExpense: boolean,
    viewExpense: boolean
}

export interface IRole extends IRoleData {
    id: string;
}

export interface IUpdateRole extends IRole {
    id: string;
}

class RoleBackendApiService {
    static API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

    static async createRole(payload: IRoleData) {
        const url = `${this.API_ENDPOINT}/role`;
        const shopId = storageService.getShopId();
        const employeeId = storageService.getEmployeeId();

        try {
            const response = await axios.post(url, {
                ...payload,
                employeeId,
                shopId
            });
            return {
                success: true,
                data: response.data,
            };
        } catch (e) {
            return {
                success: false,
                message: e.response?.data?.message || 'Something went wrong while creating the Role!'
            }
        }
    }

    static async updateRole(payload: IUpdateRole) {
        const url = `${this.API_ENDPOINT}/role`;
        const shopId = storageService.getShopId();
        try {
            const response = await axios.put(url, {
                ...payload,
                shopId
            });
            return {
                success: true,
                data: response.data,
            };
        } catch (e) {
            return {
                success: false,
                message: e.response?.data?.message || 'Something went wrong updating the Role!'
            }
        }
    }

    static async fetchAllRoles(): Promise<any> {
        const shopId = storageService.getShopId();
        const url = `${this.API_ENDPOINT}/role/${shopId}`;
        try {
            const response = await axios.get(url);
            return {
                success: true,
                data: response.data,
            };
        } catch (e) {
            return {
                success: false,
                message: e.response?.data?.message || 'Something went wrong in "Fetch All Roles" API call!'
            }
        }
    }

    static async deleteRole({id, name}: any): Promise<any> {
        const url = `${this.API_ENDPOINT}/role/${id}`;
        try {
            const response = await axios.delete(url);
            return {
                success: true,
                data: response.data,
            };
        } catch (e) {
            return {
                success: false,
                 message: e.response?.data?.message || `Something went wrong deleting the ${name} Role!`
            }
        }
    }
}

export default RoleBackendApiService;
