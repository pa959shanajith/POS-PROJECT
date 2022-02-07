import {Reducer} from "redux";
import {IAction} from "./index";
import AuthService from "../services/auth.service";
import storageService from "../services/storageService";

export interface IPOSState {
    shop: {
        id: string;
        email: string;
        name: string;
    };
    basicPosData: {
        name: string;
        currency: string;
        timeFormat: string;
        logo: string;
        enableScanner: boolean;
        storeId: string;
    }
    sessionId: string;
}

export enum posActions {
    INIT_ADMIN_DATA = 'INIT_ADMIN_DATA',
    INIT_BASIC_POS_DATA = 'INIT_BASIC_POS_DATA',
    CLOSE_SESSION = 'CLOSE_SESSION',
    ADD_SESSION = 'ADD_SESSION',
    ADD_ADMIN_DATA = 'ADD_ADMIN_DATA',
    ADMIN_LOG_OUT = 'ADMIN_LOG_OUT',
}

const initState: IPOSState = {
    shop: undefined,
    basicPosData: {
        name: "",
        currency: "",
        timeFormat: "",
        logo: "",
        enableScanner: false,
        storeId: "",
    },
    sessionId: '',
}

const posReducer: Reducer<IPOSState, IAction> = (state = initState, {type, payload}: IAction) => {
    switch (type) {
        case posActions.INIT_ADMIN_DATA: {
            if (payload.sessionId) {
                storageService.setSessionId(payload.sessionId);
            }
            return {
                ...state,
                ...payload,
            }
        }
        case posActions.INIT_BASIC_POS_DATA: {
            return {
                ...state,
                basicPosData: {
                    name: payload.name,
                    currency: payload.currency,
                    timeFormat: payload.timeFormat,
                    logo: payload.logo ? `${process.env.REACT_APP_PUBLIC_DATA_ENDPOINT}/${payload.logo}`: null,
                    enableScanner: payload.enableScanner,
                    storeId: payload.StoreId,
                },
            }
        }
        case posActions.ADD_SESSION: {
            if (payload.sessionId) {
                storageService.setSessionId(payload.sessionId);
            }
            return {
                ...state,
                ...payload,
            }
        }
        case posActions.CLOSE_SESSION: {
            storageService.removeSessionId();
            return {
                ...state,
                sessionId: undefined,
            }
        }
        case posActions.ADMIN_LOG_OUT: {
            // Clear the localstorage items
            AuthService.logoutAdmin();
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

export default  posReducer;
