import React, {useState} from 'react';
import {MODALS} from "./BillingFooterContent";

interface IBalanceModalPropsType {
    setModalState: Function,
    balanceAmount: number;
}

const BalanceModal = (props:IBalanceModalPropsType)=>{

    return (
        <div className="settle-container">
            <div className="settle-container-header">
                <h2>Balance</h2>
            </div>
            <div className="settle-bill-container-content">
                <div className="balance-container">
                    <div className="remaining-balance">
                        <span>{props.balanceAmount}</span>
                    </div>
                </div>
                <div className="submit-btn" onClick={()=>{
                    props.setModalState(MODALS.BILL_STATUS_MODAL)
                }}>
                    <span>OK</span>
                </div>
            </div>
        </div>
    )
};

export default BalanceModal;
