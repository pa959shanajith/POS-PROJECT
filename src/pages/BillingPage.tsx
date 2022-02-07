import React, {useEffect} from "react";
import BillingMainContent from "../components/billing/BillingMainContent";
import "../assets/scss/pages/billing.scss";
import HeaderComponent from "../components/base/Header";
import {useSelector} from "react-redux";
import {useHistory} from "react-router-dom";

const BillingPage = () => {
	const {token, sessionId, loginStatusChecked}  = useSelector((state: any) => {
		return {
			token:  state.userState.id,
			loginStatusChecked: state.userState.loginStatusChecked,
			sessionId: state.posState.sessionId,
		}; // TODO just update it to token
	});
	const history = useHistory();
	useEffect(() => {
		if (!token && loginStatusChecked) {
			// toast.error(`Please Log In First!`)
			history.push('/employee-login');
		} else if (!sessionId && loginStatusChecked) {
			history.push('/start-session');
		}
	});

	return (
		<>
			<HeaderComponent />
			<div className="billing-page">
				<div className="billing-page-main-content">
					<BillingMainContent/>
				</div>
			</div>
		</>

	);
};

export default BillingPage;

