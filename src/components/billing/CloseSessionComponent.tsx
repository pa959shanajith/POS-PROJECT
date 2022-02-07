import React, {useState} from "react";
import "../../assets/scss/pages/session-start.scss";
import {useHistory} from "react-router-dom";
import {toast} from "react-toastify";
import Layout from "../base/Layout";
import POSBackendApiService from "../../services/pos-backend-api.service";
import storageService from "../../services/storageService";
import {LoadingOutlined} from "@ant-design/icons";
import LayoutPOSLogoComponent from "./LayoutPOSLogoComponent";
import {KeyPadButton} from "../../constants/constant";
import AuthService from "../../services/auth.service";
import {useDispatch} from "react-redux";
import {posActions} from "../../reducers/pos-reducer";

const currencyList = [1, 5, 10, 50, 100, 500];
const currencyName = 'Qr.';

const CloseSessionComponent = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [currencyCount, setCurrencyCount] = useState<any>({});
    const [currentCurrency, setCurrentCurrency] = useState<number>(0);
    const [totalCash, setTotalCash] = useState<number>(0);
    const history = useHistory();
    const dispatch = useDispatch();

    const getKeyPad = () => {
        return KeyPadButton.map((keyPadRow) => {
            const keyPadCols = keyPadRow.map(key => {
                return (
                    <div
                        key={`${key}`}
                        id={`${key}`}
                        className="key-pad-button"
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
        let cash = currencyCount[currentCurrency];
        if (value === "Del") {
            let currentValue = !isNaN(+cash) ? `${cash}` : '0';
            currentValue = currentValue.substr(0, currentValue.length -1) || '0'
            handleCurrencyCount(+currentValue, currentCurrency);
        } else {
            let currentValue = cash ? `${cash}${value}` : value;
            handleCurrencyCount(+currentValue, currentCurrency);
        }
    }

    const handleCloseSession = async () => {
        if (!totalCash) {
            toast.error('Please add some final cash in hand before closing session!')
            return;
        }
        // Start the loader
        setIsLoading(true);
        // start session by getting Session Id from BE and saved it
        const sessionRes = await AuthService.closeSession({endCash: totalCash});
        if (sessionRes.success) {
            dispatch({ type: posActions.CLOSE_SESSION })
            toast.success('Session closed successfully, Start new one to create bills!');
            history.push('/start-session');
        }
        setIsLoading(false);
    }

    const handleCurrencyCount = (count: any, currency: any) => {
        setCurrencyCount((prevState: any) => {
            return {
                ...prevState,
                [currency]: !isNaN(+count) ? +count : 0,
            }
        });
        let updatedTotalCash = 0;
        // add up all the currency except the one is which is being changed now
        Object.keys(currencyCount)
            .filter((curr: any) => +curr !== +currency && currencyCount[curr])
            .map((curr: any) => {
                updatedTotalCash += currencyCount[curr] * (+curr);
            });
        // Now add the updated value of currency if number is entered in count field else add 0 as its total value
        updatedTotalCash = !isNaN(+count) ? updatedTotalCash + (+count * +currency) : updatedTotalCash;
        setTotalCash(updatedTotalCash);
    }

    const handleCurrencyRowChange = (curr: any) => {
        setCurrentCurrency(curr);
    }

    return(
        <Layout pageHeading="Close Session" isCentered={true} topRightChildElement={LayoutPOSLogoComponent}>
            <div className='employee-container'>
                <div className={'currency-container'}>
                    <div className={'currency-content'}>
                        {
                            currencyList.map((currency) => {
                                return (
                                    <div className='currency-row'>
                                        <div className={'currency-value'}>{currencyName} {currency}</div>
                                        <input
                                            className={'currency-count'}
                                            value={currencyCount[currency] || null}
                                            onClick={() => handleCurrencyRowChange(+currency)}
                                            onFocus={() => handleCurrencyRowChange(+currency)}
                                            onChange={(e) => handleCurrencyCount(e.target.value, currency)}
                                        />
                                        <div className={'currency-amount'}>{currencyCount[currency] ? currencyCount[currency] * currency : null}</div>
                                    </div>
                                )
                            })
                        }
                        <div className='currency-row total-row'>
                            <div className={'label'}>Total Cash</div>
                            <div className={'currency-amount'}>{totalCash ? totalCash : null}</div>
                        </div>
                    </div>
                </div>
                <div className="currency-input-container">
                    <div className={'pin-container'}>
                        <div className="keypad-container">
                            {getKeyPad()}
                        </div>
                        <div className='close-button-container'>
                            {
                                isLoading ? (
                                        <div className='close-button'>
                                            <LoadingOutlined />
                                        </div>
                                ) : (
                                    <div className='close-button' onClick={handleCloseSession}>Close session</div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};
export default CloseSessionComponent;

