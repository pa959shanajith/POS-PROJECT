import React, {useEffect} from "react";
import HeaderComponent from "../components/base/Header";
import AdminLogin from "./AdminLogin";
import {useSelector} from "react-redux";
import {useHistory} from "react-router-dom";

const AdminLoginPage = () => {
    const {token, loginStatusChecked, shopId, name, roleName}  = useSelector((state: any) => {
        return {
            token:  state.userState.id,
            name: state.userState.name,
            loginStatusChecked: state.userState.loginStatusChecked,
            roleName: state.userState.Role.name,
            shopId: state.posState.shop?.id,
        }; // TODO just update it to token
    });
    const history = useHistory();

    useEffect(() => {
        if (token) {
            // toast.success(`Already logged in as ${name} [${roleName}]`)
            history.push('/clock-action');
        } else if (shopId) {
            history.push('/employee-login');
        }
    });

    return (
        <>
            <HeaderComponent hideBusinessName />
            <AdminLogin />
        </>
    );
};

export default AdminLoginPage;

