import React from "react";
import {useHistory} from "react-router-dom";
import {useSelector} from "react-redux";

const CloseSessionButtonComponent: React.FC = () => {
    const history = useHistory();
    const { loginStatusChecked, sessionId } = useSelector((state: any) => {
        return {
            loginStatusChecked: state.userState.loginStatusChecked,
            sessionId: state.posState.sessionId,
        }
    });
    return loginStatusChecked && sessionId && (
        <button className='button-orange' onClick={() => history.push('close-session')}>Close Session</button>
  )}

export default CloseSessionButtonComponent;
