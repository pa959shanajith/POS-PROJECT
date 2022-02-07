import React from 'react';
import {MODALS} from "./BillingFooterContent";
import '../../assets/scss/components/payment-method.scss';

interface ISettleModalPropsType{
    setModalState: Function,
    setPaymentMethod: Function,
}

const PaymentMethod = (props:ISettleModalPropsType)=>{
    return(
        <div className="settle-container">
            <div className="settle-container-header">
                <h2>Choose Payment Mode</h2>
            </div>
            <div className="settle-container-content">
                <div className="settle-container-content-cash">
                    <div className="cash" onClick={()=>{
                        props.setPaymentMethod('CASH');
                        props.setModalState(MODALS.SETTLE_BILL_MODAL);
                    }}><span>CASH</span></div>
                </div>
                <div className="settle-container-content-card">
                    <div className="card" onClick={() => {
                        props.setPaymentMethod('CARD');
                        props.setModalState(MODALS.SETTLE_BILL_MODAL);
                    }}>
                        <span>CARD</span>
                    </div>
                </div>
            </div>
            <div className='button-container'>
                <div className={'button red-button'} onClick={() =>  props.setModalState(MODALS.NONE)}>Cancel</div>
            </div>
        </div>
    )
};

export default PaymentMethod;
