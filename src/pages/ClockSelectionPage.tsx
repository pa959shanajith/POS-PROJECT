import React, {useEffect} from "react";
import HeaderComponent from "../components/base/Header";
import ClockSelectionComponent from "../components/clock-selection/ClockSelectionComponent";
import {useSelector} from "react-redux";
import {useHistory} from "react-router-dom";

const ClockSelectionPage = () => {
    const {token, loginStatusChecked}  = useSelector((state: any) => {
        return {
            token:  state.userState.id,
            loginStatusChecked: state.userState.loginStatusChecked,
        }; // TODO just update it to to
        // ken
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
            <ClockSelectionComponent/>
        </>
    );
};

export default ClockSelectionPage;
