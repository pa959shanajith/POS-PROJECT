import React, {useEffect} from "react";
import HeaderComponent from "../components/base/Header";
import SessionStartComponent from "../components/billing/SessionStartComponent";
import {useSelector} from "react-redux";
import {Simulate} from "react-dom/test-utils";
import {useHistory} from "react-router-dom";

const SessionStartPage = ()=>{
    const history = useHistory();
    const { token, loginStatusChecked, sessionId } = useSelector((state: any) => {
        return {
            token: state.userState.token,
            loginStatusChecked: state.userState.loginStatusChecked,
            sessionId: state.posState.sessionId,
        }
    });

    useEffect(() => {
        if (loginStatusChecked) {
            if (!token) {
                // toast.error(`Please Log In First!`)
                history.push('/employee-login');
            } else if (sessionId) {
                history.push('/billing');
            }
        }
    });

    return (
        <>
            <HeaderComponent />
            <SessionStartComponent/>
        </>

    );
};

export default SessionStartPage;

