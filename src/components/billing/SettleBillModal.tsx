import React, {useState} from 'react';
import {MODALS} from "./BillingFooterContent";
import {KeyPadButton} from "../../constants/constant";
import {toast} from "react-toastify";


interface ISettleBillModalPropsType {
    billAmount: number;
    setModalState: Function;
    setReceivedPrice: Function;
    freezeBill: Function;
    paymentMethod: string;
}

const SettleBillModal = (props:ISettleBillModalPropsType)=>{
    const [receivedAmt, setReceivedAmt] = useState(0);

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
        if (value === "Del") {
            let currentValue = receivedAmt ? `${receivedAmt}` : '0';
            currentValue = currentValue.substr(0, currentValue.length - 1) || '0'
            setReceivedAmt(+currentValue);
        } else if (value === "OK") {
            handleComplete();
        } else {
            let currentValue = receivedAmt ? `${receivedAmt}${value}` : value;
            updateReceivedPrice(+currentValue);
            // cashInHandInput.current.focus();
        }
    }

    const updateReceivedPrice = (value: number) => {
        setReceivedAmt(value);
        props.setReceivedPrice(value);
    }

    const handleComplete = () => {
        if (props.paymentMethod === 'CASH') {
            if (+receivedAmt < +props.billAmount) {
                toast.error('Received Amount is less than the billed Amount!');
            } else {
                props.freezeBill();
                props.setModalState(MODALS.BALANCE_MODAL)
            }
        } else {
            props.setModalState(MODALS.BILL_STATUS_MODAL)
        }
    }

    return (
        <div className="settle-container">
            <div className="settle-bill-container">
                <div className="settle-container-header settle-bill-container-header">
                    <h2>Bill Settle</h2>
                </div>
                <div className="settle-bill-container-content">
                    <div className="settle-bill-container-content-bill">
                        <span>Bill (Qr)</span>
                        <div className="amt">{props.billAmount}</div>
                    </div>
                    {props.paymentMethod === 'CASH' && (
                        <div className="settle-bill-container-content-recieved">
                            <span>Received (Qr) </span>
                            <input className={"amt"} value={+receivedAmt} onChange={(e) => {
                                if (e.target.value && isNaN(Number(e.target.value)) ) {
                                    return;
                                }
                                updateReceivedPrice(Number(e.target.value));
                            }}/>
                        </div>
                    )}
                    <div className="submit-btn" onClick={handleComplete}>
                        <span>OK</span>
                    </div>
                </div>
            </div>
            {props.paymentMethod === 'CASH' && (
                <div className="keypad-container">
                    <div className={'keypad-background'}>
                        {getKeyPad()}
                    </div>
                </div>
            )}
        </div>
    )
};

export default SettleBillModal;
