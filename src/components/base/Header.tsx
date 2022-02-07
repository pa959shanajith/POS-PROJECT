import React, {useEffect, useState} from 'react';
import dayjs from "dayjs";
import '../../assets/scss/base/header.scss';
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {userActions} from "../../reducers/user-reducer";
import {posActions} from "../../reducers/pos-reducer";
import AreYouSurePopup from "./AreYouSurePopup";
import {BillingDataKeys} from "../billing/BillingMainContent";
import {toast} from "react-toastify";
import _ from "lodash";

const HeaderComponent = ({ hideBusinessName }: any) => {
    const [dateTimeString, setDateTimeString] = useState(dayjs().format('DD-MMM-YYYY . HH:mm:ss, dddd'));
    const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
    const [navigationButtons, setNavigationButtons] = useState({
        logout: false,
        adminLogout: false,
        settings: false,
        showBilling: false,
    });
    const history = useHistory();
    const dispatch = useDispatch();
    const {user, shopName} = useSelector((state: any) => {
        return {
            user: state.userState,
            shopName: state.posState.basicPosData.name
        }
    })

    const handleLogout = () => {
        if (navigationButtons.adminLogout) {
            dispatch({ type: posActions.ADMIN_LOG_OUT })
            history.push('/admin-login');
        } else {
            dispatch({ type: userActions.LOG_OUT })
            history.push('/employee-login');
        }
    }

    useEffect(() => {
        let logout = false;
        let adminLogout = false;
        let settings = false;
        let showBilling = false;
        switch (history?.location?.pathname) {
            case '/employee-login': {
                logout = true;
                adminLogout = true;
                break;
            }
            case '/start-session': {
                logout = true;
                settings = true;
                break;
            }
            case '/billing': {
                logout = true;
                break;
            }
            case '/settings': {
                logout = true;
                showBilling = true;
                break;
            }
            case '/close-session': {
                logout = true;
                settings = true;
                break;
            }
        }
        setNavigationButtons({
            ...navigationButtons,
            logout,
            adminLogout,
            settings,
            showBilling
        });
        setInterval(() => {
            setDateTimeString(dayjs().format('DD-MMM-YYYY . HH:mm:ss, dddd'));
        }, 1000);
    }, []);

    const handleShowLogoutConfirmationModal = () => {
        const data = localStorage.getItem(BillingDataKeys.BILL_ORDERS) ? JSON.parse(localStorage.getItem(BillingDataKeys.BILL_ORDERS)) : null;
        if (!_.isEmpty(data)) {
            toast.error('Cannot logout until there are some billing data left in system!');
            return;
        }
        setShowLogoutConfirmation(true)
    }

    return (
        <div className='header-container'>
            <div className={'header'}>
                <div className='time-container'>
                    {dateTimeString}
                </div>
                {!hideBusinessName && (
                    <div className='shop-name'>{shopName || 'POS BusinessName'}</div>
                )}
                <div className='user-name-container'>
                    {user.name && <div className={'user-name'}>{user.name}</div>}
                    {navigationButtons.showBilling && (
                        <div className={'logout-btn'}>
                            <button onClick={() => history.push('/billing')}> Billing </button>
                        </div>
                    )}
                    {navigationButtons.settings && (
                        <div className={'logout-btn'}>
                            <button onClick={() => history.push('/settings')}> Settings </button>
                        </div>
                    )}
                    {navigationButtons.logout && (
                        <div className={'logout-btn'}>
                            <button onClick={handleShowLogoutConfirmationModal}> {navigationButtons.adminLogout ? 'Admin Logout' : 'Logout'} </button>
                        </div>
                    )}
                </div>
            </div>
            {
                showLogoutConfirmation && (
                    <AreYouSurePopup
                        title={`Are you sure you want to logout ${navigationButtons.adminLogout ? 'the admin ?' : '?'}`}
                        cancelConfirmation={() => setShowLogoutConfirmation(false)}
                        doneConfirmation={handleLogout}
                    />
                )
            }
        </div>
    )
}

export default HeaderComponent;
