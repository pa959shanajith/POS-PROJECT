import axios from "axios";
import storageService from "./storageService";

class EmailBackendApiService {
    static API_ENDPOINT = `${process.env.REACT_APP_API_ENDPOINT}/email-config`;

    static async getEmailSetup() {
        const shopId = storageService.getShopId();
        if (!shopId) {
            return {
                success: false,
                message: 'No shopId found, please login as admin!',
            };
        }
        const url = `${this.API_ENDPOINT}/${shopId}`;
        try {
            const response = await axios.get(url);
            return {
                success: true,
                data: response.data
            };
        } catch (e) {
            return {
                success: false,
                message: e.response?.data?.message || 'Something went wrong while getting the email config data',
            };
        }
    }

    static async updateEmailSetup(payload: any) {
        const url = this.API_ENDPOINT;
        const shopId = storageService.getShopId();
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
                message: e.response?.data?.message || 'Something went wrong while configuring the email Setup',
            };
        }
    }
}

export default EmailBackendApiService;
