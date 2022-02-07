import axios from "axios";
import storageService from "./storageService";
import {toast} from "react-toastify";

export interface IExpense {
    shopId: string,
    date: string,
    expenseCategoryId: number,
    cost: number,
    description: string
}

export interface IExpenseCategory {
    shopId: string,
    name: string;
    description: string;
}

class ExpenseBackendApiService {
    static API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

    static async createExpenseCategory(payload: IExpenseCategory) {
        const shopId = storageService.getShopId();
        const url = `${this.API_ENDPOINT}/expense-category`;
        try {
            const response = await axios.post(url, {
                ...payload,
                shopId,
            });
            return response.data;
        } catch (e) {
            toast.error('Something went wrong in "Add Material" API!');
        }
    }

    static async fetchALlExpenseCategories() {
        const shopId = storageService.getShopId();
        const url = `${this.API_ENDPOINT}/expense-category/${shopId}`;
        try {
            const response = await axios.get(url);
            return response.data;
        } catch (e) {
            toast.error('Something went wrong!');
        }
    }

    static async updateExpenseCategory(payload: IExpenseCategory) {
        const url = `${this.API_ENDPOINT}/expense-category`;
        try {
            const response = await axios.put(url, {
                ...payload,
            });
            return response.data;
        } catch (e) {
            console.error('Something went wrong!');
        }
    }

    static async deleteExpenseCategory(expenseCatId: string) {
        const url = `${this.API_ENDPOINT}/expense-category/${expenseCatId}`;
        try {
            const response = await axios.delete(url);
            return {
                success: true,
                data: response.data
            };
        } catch (e) {
            return {
                success: false,
                message: e.response?.data.message || 'Something went wrong while deleting the expense category!',
            }
        }
    }

    static async createExpense(payload: IExpense) {
        const shopId = storageService.getShopId();
        const url = `${this.API_ENDPOINT}/expense`;
        try {
            const response = await axios.post(url, {
                ...payload,
                shopId,
            });
            return response.data;
        } catch (e) {
            toast.error('Something went wrong in "Add Material" API!');
        }
    }

    static async fetchALlExpenseItems() {
        const shopId = storageService.getShopId();
        const url = `${this.API_ENDPOINT}/expense/${shopId}`;
        try {
            const response = await axios.get(url);
            return response.data;
        } catch (e) {
            toast.error('Something went wrong!');
        }
    }

    static async updateExpenseItem(payload: IExpenseCategory) {
        const url = `${this.API_ENDPOINT}/expense`;
        try {
            const response = await axios.put(url, {
                ...payload,
            });
            return response.data;
        } catch (e) {
            console.error('Something went wrong!');
        }
    }

    static async deleteExpense(expenseId: string) {
        const url = `${this.API_ENDPOINT}/expense/${expenseId}`;
        try {
            const response = await axios.delete(url);
            return {
                success: true,
                data: response.data
            };
        } catch (e) {
            return {
                success: false,
                message: e.response?.data.message || 'Something went wrong while deleting the expense!',
            }
        }
    }

}

export default ExpenseBackendApiService;
