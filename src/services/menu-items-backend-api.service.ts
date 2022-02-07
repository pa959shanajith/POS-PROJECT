import axios from "axios";
import storageService from "./storageService";
import {toast} from "react-toastify";

export interface IMenuCategory {
    shopId: string,
    name: string,
    units: number,
    price: number,
    description: string,
}

class MenuItemsBackendApiService {
    static API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

    static async createMenuCategory(payload: IMenuCategory) {
        const shopId = storageService.getShopId();
        const url = `${this.API_ENDPOINT}/menu-item-category`;
        try {
            const response = await axios.post(url, {
                ...payload,
                shopId,
            });
            return response.data;
        } catch (e) {
            toast.error('Something went wrong while creating menu category!');
        }
    }

    static async fetchAllMenuCategories() {
        const shopId = storageService.getShopId();
        const url = `${this.API_ENDPOINT}/menu-item-category/${shopId}`;
        try {
            const response = await axios.get(url);
            return {
                success: true,
                data: response.data,
            }
        } catch (e) {
            return {
                success: false,
                message: e.response?.data?.message || 'Something went wrong!'
            }
        }
    }

    static async updateMenuCategory(payload: IMenuCategory) {
        const url = `${this.API_ENDPOINT}/menu-item-category`;
        try {
            const response = await axios.put(url, {
                ...payload,
            });
            return response.data;
        } catch (e) {
            console.error('Something went wrong!');
        }
    }

    static async createMenuItemVariant(payload: any) {
        const shopId = storageService.getShopId();
        const employeeId = storageService.getEmployeeId();
        const url = `${this.API_ENDPOINT}/menu-item/variant`;
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
                message: e.response?.data?.message || 'Something went wrong while creating the variant'
            }
        }
    }

    static async updateMenuItemVariant(payload: any) {
        const shopId = storageService.getShopId();
        const url = `${this.API_ENDPOINT}/menu-item/variant`;
        try {
            const response = await axios.put(url, {
                ...payload,
                shopId,
            });
            return {
                success: true,
                data: response.data,
            }
        } catch (e) {
            return {
                success: false,
                message: e.response?.data?.message || 'Something went wrong while updating the variant'
            }
        }
    }

    static async createMenuItem(payload: any) {
        const shopId = storageService.getShopId();
        const employeeId = storageService.getEmployeeId();
        const url = `${this.API_ENDPOINT}/menu-item`;
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
                message: e.response?.data?.message || 'Something went wrong while creating the item'
            }
        }
    }

    static async fetchAllMenuItems() {
        const shopId = storageService.getShopId();
        const url = `${this.API_ENDPOINT}/menu-item/${shopId}`;
        try {
            const response = await axios.get(url);
            return {
                success: true,
                data: response.data,
            }
        } catch (e) {
            return {
                success: false,
                message: e.response?.data?.message || 'Something went wrong while fetching the items'
            }
        }
    }


    static async fetchAllFavouriteMenuItems() {
        const shopId = storageService.getShopId();
        const url = `${this.API_ENDPOINT}/menu-item/${shopId}/favourite`;
        try {
            const response = await axios.get(url);
            return response.data;
        } catch (e) {
            toast.error('Something went wrong!');
        }
    }

    static async updateMenuItem(payload: any) {
        const shopId = storageService.getShopId();
        const url = `${this.API_ENDPOINT}/menu-item`;
        try {
            const response = await axios.put(url, {
                ...payload,
                shopId,
            });
            return {
                success: true,
                data: response.data,
            }
        } catch (e) {
            return {
                success: false,
                message: e.response?.data?.message || 'Something went wrong while updating the item'
            }
        }
    }

    static async deleteMenuItem(menuItemId: string) {
        const url = `${this.API_ENDPOINT}/menu-item/${menuItemId}`;
        try {
            const response = await axios.delete(url);
            return {
                success: true,
                data: response.data,
            }
        } catch (e) {
            return {
                success: false,
                message: e.response?.data?.message || 'Something went wrong while deleting the item'
            }
        }
    }

    static async deleteVariant(menuItemId: string, variantId: string) {
        const url = `${this.API_ENDPOINT}/menu-item/variant/${menuItemId}/${variantId}`;
        try {
            const response = await axios.delete(url);
            return {
                success: true,
                data: response.data,
            }
        } catch (e) {
            return {
                success: false,
                message: e.response?.data?.message || 'Something went wrong while deleting the item'
            }
        }
    }

    static async fetchTopSellingItems(payload: {startDate: string, endDate: string}) {
        const shopId = storageService.getShopId();
        const url = `${this.API_ENDPOINT}/menu-item/top-selling-item/${shopId}`;
        try {
            const response = await axios.post(url, {
                ...payload,
            });
            return {
                success: true,
                data: response.data,
            }
        } catch (e) {
            return {
                success: false,
                message: e.response?.data?.message || 'Something went wrong while fetching the top selling items'
            }
        }
    }

    static async fetchMenuItemsByCategoryId(categoryId: string) {
        const shopId = storageService.getShopId();
        const url = `${this.API_ENDPOINT}/menu-item/${shopId}/${categoryId}`;
        try {
            const response = await axios.get(url);
            return response.data;
        } catch (e) {
            toast.error('Something went wrong!');
        }
    }
}

export default MenuItemsBackendApiService;
