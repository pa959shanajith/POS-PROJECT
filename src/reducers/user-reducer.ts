import {IRole} from "../services/role-backend-api.service";
import {Reducer} from "redux";
import {IAction} from "./index";
import POSBackendApiService from "../services/pos-backend-api.service";
import AuthService from "../services/auth.service";
import storageService from "../services/storageService";

export interface IUserState {
    id: string;
    name: string;
    token: string;
    pin: string;
    RoleId: string;
    ShopId: string;
    Role: IRole | {};
    loginStatusChecked: boolean;
}

export enum userActions {
    ADD_USER_DATA = 'ADD_USER_DATA',
    LOG_OUT = 'LOG_OUT',
}

const initState: IUserState = {
    id: '',
    name: '',
    token: '',
    pin: '',
    RoleId: '',
    ShopId: '',
    Role: {},
    loginStatusChecked: false,
}

const userReducer: Reducer<IUserState, IAction> = (state = initState, {type, payload}: IAction) => {
    switch (type) {
        case userActions.ADD_USER_DATA: {
            if (payload.id) {
                storageService.setEmployeeId(payload.id)
            }
            return {
                ...state,
                ...payload,
                loginStatusChecked: true,
            }
        }
        case userActions.LOG_OUT: {
            // Clear the localstorage items
            AuthService.logoutEmployee();
            return {
                ...initState,
            }
        }
        default: {
            return {
                ...state
            }
        }
    }
}

export default  userReducer;
