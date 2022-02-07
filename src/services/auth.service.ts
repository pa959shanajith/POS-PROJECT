import axios from "axios";
import storageService from "./storageService";
import {toast} from "react-toastify";
import dayjs from "dayjs";
import StorageService from "./storageService";
import {ILoginPayload} from "./shop-backend-api.service";
import {IEmployeeLogin} from "./employee-backend-api.service";
import {start} from "repl";

export interface IStartSessionPayload {
    startCash: number
}

export interface ICloseSessionPayload {
    endCash: number;
}

class AuthService {
    static API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

    static async adminLogin(payload: ILoginPayload) {
        const url = `${this.API_ENDPOINT}/auth/login`;
        try {
            const response = await axios.post(url, {
                ...payload,
            });
            if (response.status === 200) {
                // Save the data into sessionStorage
                StorageService.setShopId(response.data.id);
            }
            return {
                success: true,
                data: response.data
            };
        } catch (e) {
            return {
                success: false,
                message: e.response?.data?.message || 'Something went wrong while logging!'
            }
        }
    }

    static async employeeLogin(payload: IEmployeeLogin) {
        const url = `${this.API_ENDPOINT}/auth/pin-login`;
        try {
            const clientId = StorageService.getClientId();
            const shopId = StorageService.getShopId();
            const response = await axios.post(url, {
                clientId,
                shopId,
                ...payload,
            });
            if (response.status === 200) {
                // Save the data into sessionStorage
                StorageService.setToken(response.data.token);
            }
            return {
                success: true,
                data: response.data,
            };

        } catch (e) {
            return {
                success: false,
                message: e.response?.data.message || 'Something went wrong while logging you in!',
            };
        }
    }

    static async startSession(payload: IStartSessionPayload): Promise<any> {
        const shopId = storageService.getShopId();
        const employeeId = storageService.getEmployeeId();
        const date = dayjs().format('YYYY-MM-DD'); // TODO please make ask BE for a common date format
        const url = `${this.API_ENDPOINT}/session`;
        try {
            const response = await axios.post(url, {
                ...payload,
                shopId,
                employeeId,
                date,
            });
            return {
                success: true,
                data: response.data
            };
        } catch (e) {
            return {
                success: false,
                message: e.response?.data?.message || 'Something went wrong while starting the session!',
            }
        }
    }

    static async closeSession(payload: ICloseSessionPayload): Promise<any> {
        const shopId = storageService.getShopId();
        const sessionId = storageService.getSessionId();
        const employeeId = storageService.getEmployeeId();
        const endedAt = dayjs().format('MM-DD-YYYY');
        const url = `${this.API_ENDPOINT}/session`;
        try {
            const response = await axios.put(url, {
                ...payload,
                id: sessionId,
                shopId,
                employeeId,
                endedAt,
            });
            return {
                success: true,
                data: response.data
            };
        } catch (e) {
            toast.error('Something went wrong closing the session!');
            return  {
                success: false,
                data: {}
            }
        }
    }

    static async clockIn() {
        const url = `${this.API_ENDPOINT}/attendance`;
        const employeeId = storageService.getEmployeeId();
        const shopId = storageService.getShopId();
        try {
            const response = await axios.post(url, {
                employeeId,
                shopId,
                time: dayjs().format("YYYY-MM-DD:HH:mm:ss")
            });
            return {
                success: true,
                data: response.data,
            };
        } catch (e) {
            toast.error(e.response?.data?.message || 'Something went wrong while clocking in!');
            return {
                success: false,
                data: null,
            };
        }
    }

    static async clockOut() {
        const url = `${this.API_ENDPOINT}/attendance`;
        const shopId = storageService.getShopId();
        const employeeId = storageService.getEmployeeId();
        try {
            const response = await axios.put(url, {
                employeeId,
                shopId,
                time: dayjs().format("YYYY-MM-DD:HH:mm:ss")
            });
            return {
                success: true,
                data: response.data,
            };
        } catch (e) {
            return {
                success: false,
                message: e.response?.data?.message || `Something went wrong while performing clock out action!`,
            };
        }
    }

    static async getCurrentSession(): Promise<any> {
        const shopId = storageService.getShopId();
        if (!shopId) {
            return {
                success: false,
                message: 'No shopId found, please login as admin!',
            };
        }
        const url = `${this.API_ENDPOINT}/session/get-current-session/${shopId}`;
        try {
            const response = await axios.get(url);
            return {
                success: true,
                data: response.data
            };
        } catch (e) {
            // toast.error('Something went wrong while active session!');
            return {
                success: false,
                message: e.response?.data?.message || `Something went wrong while active session!`,
            };
        }
    }

    static async getCurrentUserDetails() {
        const url = `${this.API_ENDPOINT}/auth/me`;
        const token = StorageService.getToken();
        if (!token) {
            return {
                success: false,
                message: 'No user token found on the system!',
            };
        }
        try {
            const response = await axios.post(url, {
                token,
            });
            if (response.status === 200) {
                // Save the data into sessionStorage
                StorageService.setToken(response.data.token);
            }
            return {
                success: true,
                data: response.data,
            };

        } catch (e) {
            // toast.error(e.message);
            return {
                success: false,
                message: e.response?.data?.message || `Something went wrong while getting user detail!`,
            };
        }
    }

    static logoutEmployee(): void {
        localStorage.removeItem('CLIENT_ID');
        localStorage.removeItem('EMPLOYEE_ID');
        localStorage.removeItem('TOKEN');
        storageService.removeClientId();
        storageService.removeEmployeeId();
        storageService.removeToken();
        // Shop id will remain in the LS
    }

    static logoutAdmin() {
        storageService.removeShopId();
        storageService.removeClientId();
        storageService.removeSessionId();
        storageService.removeEmployeeId();
        storageService.removeToken();
    }

    static async getAttendance({startDate, endDate}: any): Promise<any> {
        const shopId = storageService.getShopId();
        const url = `${this.API_ENDPOINT}/attendance/${shopId}`;
        try {
            const response = await axios.get(url, {
                params: {
                    startDate,
                    endDate,
                }
            });
            return {
                success: true,
                data: response.data
            };
        } catch (e) {
            toast.error(e.response?.data?.message || 'Something went wrong closing the session!');
            return  {
                success: false,
                data: {}
            }
        }
    }

    static async fetchAllSessions({startDate, endDate}: any): Promise<any> {
        const shopId = storageService.getShopId();
        const url = `${this.API_ENDPOINT}/session/${shopId}`;
        try {
            const response = await axios.get(url, {
                params: {
                    startDate,
                    endDate,
                }
            });
            return {
                success: true,
                data: response.data,
            }
        } catch (e) {
            toast.error('Something went wrong while fetching the billing report!');
            return {
                success: false,
                data: {}
            }
        }
    }
}

export default AuthService;
