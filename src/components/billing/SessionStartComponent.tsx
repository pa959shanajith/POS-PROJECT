import React, {useState} from "react";
import "../../assets/scss/pages/session-start.scss";
import {useHistory} from "react-router-dom";
import {toast} from "react-toastify";
import Layout from "../base/Layout";
import LayoutPOSLogoComponent from "./LayoutPOSLogoComponent";
import {KeyPadButton} from "../../constants/constant";
import AuthService from "../../services/auth.service";
import {useDispatch, useSelector} from "react-redux";
import {posActions} from "../../reducers/pos-reducer";

const SessionStartComponent = () => {
    const [cash, setCash] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const cashInHandInput = React.createRef<HTMLInputElement>();
    const history = useHistory();
    const dispatch = useDispatch();

    const getKeyPad = () => {
        return KeyPadButton.map((keyPadRow) => {
            const keyPadCols = keyPadRow.map(key => {
                return (
                    <div
                        key={`${key}`}
                        id={`${key}`}
                        className={`key-pad-button ${key === 'OK' && 'disabled-key-pad'}`}
                        onClick={onPinChangeHandler}
                    >{key}</div>
                )
            });

            return (
                <div className="keypad-row">
                    {keyPadCols}
                </div>
            )
        })
    }

    const onPinChangeHandler = async (e: any) => {
        const value = e.target.id;
        if (value === "Del") {
            let currentValue = cash ? `${cash}` : '0';
            currentValue = currentValue.substr(0, currentValue.length -1) || '0'
            setCash(+currentValue);
        } else if (value !== "OK") {
            let currentValue = cash ? `${cash}${value}` : value;
            setCash(+currentValue);
            cashInHandInput.current.focus();
        }
    }

    const handleCashUpdate = (e: any) => {
        setCash(e.target.value)
    }

    const handleCashConfirm = async () => {
        if (!cash) {
            toast.error('Please add some cash in hand before starting the session!')
            return;
        }
        // Start the loader
        setIsLoading(true);
        // start session by getting Session Id from BE and saved it
        const sessionRes = await AuthService.startSession({startCash: cash});
        if (sessionRes.success) {
            dispatch({
                type: posActions.ADD_SESSION,
                payload: { sessionId: sessionRes.data.id}
            });
            toast.success(`Session with ${cash} cash in hand started!`)
            setIsLoading(false);
            history.push('/billing');
        } else {
            toast.error(sessionRes.message);
        }
    }

    return(
        <Layout pageHeading="Confirm Cash In Hand" isCentered={true} topRightChildElement={LayoutPOSLogoComponent}>
            <div className='employee-container'>
                <div className="cash-hand-container">
                    <div className={'pin-container'}>
                        <div className={'cash-hand-text-container'}>
                            <span> Cash In Hand</span>
                        </div>
                        <input
                            ref={cashInHandInput}
                            className="pin-input-field"
                            name={"pin-value"}
                            value={cash}
                            onChange={handleCashUpdate}
                        />
                        <div className="keypad-container">
                            {getKeyPad()}
                        </div>
                    </div>
                </div>
                <div className={'cash-confirm-container'}>
                    <div className={'cash-confirm-content'}>
                        <div className={'cash-confirm-text'}>
                           <span>Confirm Cash In Hand</span>
                        </div>
                        <div className={'cash-confirm-button-container'}>
                            <button className={'button-orange'} onClick={handleCashConfirm}>
                                Open New <br/> Session
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};
export default SessionStartComponent;
