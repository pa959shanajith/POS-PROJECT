import {Action, combineReducers} from "redux";
import userReducer from "./user-reducer";
import posReducer from "./pos-reducer";

export interface IAction extends Action {
    payload: any;
}

const rootReducer: any = combineReducers({
    userState: userReducer,
    posState: posReducer,
});

export default rootReducer;
