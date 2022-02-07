import React from 'react';
import {MODALS} from "./BillingFooterContent";
import {CheckCircleTwoTone, ExclamationCircleOutlined, LoadingOutlined} from "@ant-design/icons";

interface IBillStatusModalPropsType{
    setModalState: Function,
    loading: boolean;
    success: boolean;
}

const BillStatusModal = (props:IBillStatusModalPropsType) => {

    return (
        <div className="bill-success-container">
            <div className="bill-success-container-header">
                <div className={'bill-success-container-icon'}>
                    {props.loading && (
                        <LoadingOutlined />
                    )}
                    {!props.loading && props.success && (
                        <CheckCircleTwoTone twoToneColor="#52c41a" />
                    )}
                    {!props.loading && !props.success &&(
                        <ExclamationCircleOutlined />
                    )}
                </div>
                <h2>Bill Settle Status</h2>
            </div>
            <div className="bill-success-container-content">
                {props.loading && 'Loading...'}
                {!props.loading && props.success ? 'Bill has been settled successfully!': ''}
                {!props.loading && !props.success ? 'Something Went Wrong': ''}
            </div>
            <div className={'button-container'}>
                <div className={'button'} onClick={() => {
                    if (!props.loading) {
                        props.setModalState(MODALS.NONE)
                    }
                }}>DONE</div>
            </div>
        </div>
    )
};

export default BillStatusModal;
