import React, {useEffect} from "react";
import HeaderComponent from "../components/base/Header";
import EmployeeLogin from "./EmployeeLogin";
import {useSelector} from "react-redux";
import {useHistory} from "react-router-dom";

const EmployeeLoginPage = ()=>{
    const {token, name, roleName}  = useSelector((state: any) => {
        return {
            token:  state.userState.token,
            name: state.userState.name,
            roleName: state.userState.Role.name,

        }; // TODO just update it to token
    });
    const history = useHistory();

    useEffect(() => {
        if (token) {
            // toast.success(`Already logged in as ${name} [${roleName}]`)
            history.push('/clock-action');
        } else {

        }
    });

    return (
        <>
            <HeaderComponent />
            <EmployeeLogin/>
        </>

    );
};

export default EmployeeLoginPage;

