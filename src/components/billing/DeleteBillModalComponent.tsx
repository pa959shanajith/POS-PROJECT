import React, {useState} from 'react';
import Overlay from "../../assets/scss/components/Overlay";
import {CheckCircleTwoTone, ExclamationCircleOutlined, LoadingOutlined} from "@ant-design/icons";
import {MODALS} from "./BillingFooterContent";
import {toast} from "react-toastify";

const DeleteBillModalComponent = ({setModalState, deleteBill, loading, success, error}: any) => {
    const [showStatus, setShowStatus] = useState(false);
    const [notes, setNotes] = useState('');

    const handleDelete = () => {
        if (notes) {
            setShowStatus(true);
            deleteBill(notes);
        } else {
            toast.error('Notes are required to add void bills!')
        }
    }

    return (
        <div className="kitchen-info-main">
            <Overlay closeOverlay={() => setModalState(MODALS.NONE)}>
                {showStatus ? (
                    <div className="bill-success-container">
                        <div className="bill-success-container-header">
                            <div className={'bill-success-container-icon'}>
                                {loading && (
                                    <LoadingOutlined/>
                                )}
                                {success && (
                                    <CheckCircleTwoTone twoToneColor="#52c41a"/>
                                )}
                                {error && (
                                    <ExclamationCircleOutlined/>
                                )}
                            </div>
                            <h2>Void Bill Status</h2>
                        </div>
                        <div className="bill-success-container-content">
                            {loading && 'Loading...'}
                            {success ? 'Void Bill has been added successfully!' : ''}
                            {error ? 'Something Went Wrong' : ''}
                        </div>
                        <div className='button-container'>
                            <div className={'button'} onClick={() => setModalState(MODALS.NONE)}>
                                DONE
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bill-success-container">
                        <div className="bill-success-container-header">
                            <h2>Are you sure you want to add current bill as VOID bill?</h2>
                        </div>
                        <div className='void-bill-notes-label'>
                            Add Notes
                        </div>
                        <div className='void-bill-notes'>
                            <input type="text" name='notes' value={notes} onChange={(e) => setNotes(e.target.value)}/>
                        </div>
                        <div className='button-container'>
                            <div className={'button red-button'} onClick={() => {
                                setModalState(MODALS.NONE);
                            }}>Cancel</div>
                            <div className={'button'} onClick={() => {
                                if (!loading) {
                                    handleDelete();
                                }
                            }}>Yes</div>
                        </div>
                    </div>
                )}
            </Overlay>
        </div>
    )
}

export default DeleteBillModalComponent;
