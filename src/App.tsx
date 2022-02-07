import React, {useEffect, useState} from "react";
import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import {ToastContainer} from 'react-toastify';
import {message, Spin} from 'antd';
import StorageService from './services/storageService';
import BillingPage from "./pages/BillingPage";
import SessionStartPage from "./pages/SessionStartPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import EmployeeLoginPage from "./pages/EmployeeLoginPage";
import SettingsPage from "./pages/SettingsPage";
import 'antd/dist/antd.css'
import 'react-toastify/dist/ReactToastify.css';
// import "../src/assets/scss/app.scss";
import CloseSessionPage from "./pages/CloseSessionPage";
import axios from "axios";
import db from "./db";
import {TABLES} from "./db/db.constants";
import ClockSelectionPage from "./pages/ClockSelectionPage";
import {useDispatch} from "react-redux";
import {userActions} from "./reducers/user-reducer";
import AuthService from "./services/auth.service";
import {posActions} from "./reducers/pos-reducer";
import ShopBackendApiService from "./services/shop-backend-api.service";
import POSBackendApiService from "./services/pos-backend-api.service";

axios.interceptors.response.use(
    function(successfulReq) {
      return successfulReq;
    },
    async function(error) {
        if(error.toJSON().message === 'Network Error'){
            const config = error.toJSON().config;
            const {url, data, method} = config
            await db.table(TABLES.APICALLS).add({
                url,
                data,
                method
            });
        }
        return Promise.reject(error);
    }
);

function App() {
    const [loadingState, setLoadingState] = useState(true);
    const dispatch = useDispatch();
    useEffect(() => {
        initReduxStore();
    }, []);

    const initReduxStore = async () => {
        const shopRes = await ShopBackendApiService.getShopDetails();
        if (shopRes.success) {
            dispatch({
                type: posActions.INIT_ADMIN_DATA,
                payload: {
                    shop: shopRes.data,
                },
            });
        } else {
            console.log(shopRes.message);
        }

        // Fetching the session info
        const sessionRes = await AuthService.getCurrentSession();
        if (sessionRes.success) {
            dispatch({
                type: posActions.INIT_ADMIN_DATA,
                payload: {
                    sessionId: sessionRes.data.id
                },
            });
        } else {
            console.log(sessionRes.message);
        }

        // Fetching the basic POS Setup data
        const basicPOSSetupRes = await POSBackendApiService.getBasicSetup();
        if (basicPOSSetupRes.success) {
            dispatch({
                type: posActions.INIT_BASIC_POS_DATA,
                payload: {
                    ...basicPOSSetupRes.data,
                }
            });
        } else {
            console.log(basicPOSSetupRes.message);
        }

        // Get the current activate User
        const employeeRes = await AuthService.getCurrentUserDetails();
        if (employeeRes.success) {
            dispatch({
                type: userActions.ADD_USER_DATA,
                payload: {
                    ...employeeRes.data.employee,
                    token: employeeRes.data.token,
                    clockedInAlready: employeeRes.data.clockedInAlready,
                }
            });
        } else {
            console.log(employeeRes.message)
        }
        // Finally reset the loading state
        setLoadingState(false);
    }

  return (
    <div className={"App"}>
      <ToastContainer />
        {loadingState ? (
            <div className={"app-content"}>
                <Spin size="large"/>
            </div>
        ) : (
            <Router>
                <div className={"app-content"}>
                    <Switch>
                        <Route path='/admin-login' exact={true} component={AdminLoginPage}/>
                        <ProtectedRoute path='/employee-login' exact={true} component={EmployeeLoginPage}/>
                        <ProtectedRoute path= '/settings' exact={true} component={SettingsPage}/>
                        <ProtectedRoute path='/start-session' component={SessionStartPage} />
                        <ProtectedRoute path='/close-session' component={CloseSessionPage} />
                        <ProtectedRoute path='/clock-action' component={ClockSelectionPage} />
                        <ProtectedRoute path='/billing' component={BillingPage} />
                        <Redirect to={'/billing'} />
                    </Switch>
                </div>
            </Router>
        )}
    </div>
  );
}

const ProtectedRoute = (props: any) => {
  const token = StorageService.getToken();
  const shopId = StorageService.getShopId();
  // Check if this token is valid or not by hitting the /me API?
  return token || shopId ? (
      <Route path={props.path} exact={props.exact} component={props.component} />
  ) : <Redirect to={'/admin-login'}/>;
}

export default App;
