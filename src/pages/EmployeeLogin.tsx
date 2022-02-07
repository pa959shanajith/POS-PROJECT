import React, {useState} from "react";
import "../assets/scss/pages/employee-login.scss";
import Layout from "../components/base/Layout";
import {useHistory} from "react-router-dom";
import EmployeeBackendApiService from "../services/employee-backend-api.service";
import {toast} from "react-toastify";
import storageService from "../services/storageService";
import POSBackendApiService from "../services/pos-backend-api.service";
import {useDispatch, useSelector} from "react-redux";
import {userActions} from "../reducers/user-reducer";
import AuthService from "../services/auth.service";

const EmployeeLogin = () => {
    const [pinValue, setPinValue] = useState<number[]>([]);

    const history = useHistory();
    const dispatch = useDispatch();

    const {basicPosData} = useSelector((state: any) => {
        return {
            basicPosData: state.posState.basicPosData
        }
    })

    const keyPadButton = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        ['Del', 0, 'OK'],
    ]
    const getKeyPad = () => {
        return keyPadButton.map((keyPadRow) => {
            const keyPadCols = keyPadRow.map(keyPadButton => {
                return (
                    <div
                        key={`${keyPadButton}`}
                        id={`${keyPadButton}`}
                        className="key-pad-button"
                        onClick={onPinChangeHandler}
                    >{keyPadButton}</div>
                )
            });

            return (
                <div className="keypad-row">
                    {keyPadCols}
                </div>
            )
        })
    }

    const onPinChangeHandler = (e: any) => {

        const value = e.target.id;
        if (value === "Del") {
            const pinValueCopy = [
                ...pinValue,
            ]
            pinValueCopy.pop();
            setPinValue(pinValueCopy)
        } else if (value === "OK") {
            // Hitting API call
            handleLogin();
        } else {
            if (pinValue.length < 4) {
                const pinValueCopy = [
                    ...pinValue,
                ];
                pinValueCopy.push(+value);
                setPinValue(pinValueCopy);
            }
        }
    }

    const handleLogin = async () => {
        const res = await AuthService.employeeLogin({
            pin: pinValue.join(''),
        });
        if (res.success) {
            toast.success('Logged in successfully!');
            dispatch({
                type: userActions.ADD_USER_DATA,
                payload: {
                    ...res.data.employee,
                    token: res.data.token,
                    clockedInAlready: res.data.clockedInAlready,
                },
            });
            history.push('/clock-action')
        } else {
            toast.error(res.message);
        }
    }

    return(
       <Layout pageHeading="employee Login" isCentered={true}>
           <div className='employee-container'>
                <div className={'pin-container'}>
                    <input
                        className="pin-input-field"
                        name={"pin-value"}
                        maxLength={4}
                        value={'*'.repeat(pinValue.length)}
                    />
                    <div className="keypad-container">
                        {getKeyPad()}
                    </div>
                </div>
                <div className={'client-logo-container'}>
                    {basicPosData.logo ? <img src={basicPosData.logo} alt="logo"/> : null}
                </div>
           </div>
       </Layout>
    );
};
export default EmployeeLogin;
