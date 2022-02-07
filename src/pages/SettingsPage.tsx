import React, {useEffect} from "react";
import HeaderComponent from "../components/base/Header";
import SettingsComponent from "./SettingsComponent";
import {useSelector} from "react-redux";
import {useHistory} from "react-router-dom";

const SettingsPage = () => {
    const {token, loginStatusChecked}  = useSelector((state: any) => {
        return {
            token:  state.userState.id,
            loginStatusChecked: state.userState.loginStatusChecked,
        }; // TODO just update it to token
    });
    const history = useHistory();
    useEffect(() => {
        if (!token && loginStatusChecked) {
            // toast.error(`Please Log In First!`)
            history.push('/employee-login');
        }
    });
    return (
        <>
            <HeaderComponent />
            <SettingsComponent/>
        </>

    );
};

export default SettingsPage;

