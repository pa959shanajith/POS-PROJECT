import React, {useState} from 'react';
import {MODALS} from "./BillingFooterContent";
import {toast} from "react-toastify";

interface ITakeAwayModalPropsType{
    selectTakeAway: Function;
    setModalState: Function;
}

const TakeAwayModalComponent = (props:ITakeAwayModalPropsType) => {
    const [takeAwayName, setTakeAwayName] = useState<any>('');

    const handleSelect = () => {
        if (takeAwayName) { // Check if its just a empty object
            props.selectTakeAway(takeAwayName);
            props.setModalState(MODALS.NONE);
        } else {
            toast.error('Please add a take away name!');
        }
    }

    return(
        <div className="select-table-container">
            <div className="select-table-container-header">
                <h2>Take Away</h2>
            </div>
            <div className="select-table-container-content">
                <div className="take-away-container">
                    <div className='label'>Enter Take Away Name</div>
                    <input type="text" name='takeAwayName' value={takeAwayName} onChange={(e) => setTakeAwayName(e.target.value)}/>
                </div>
                <div className='button-container'>
                    <div className='button cancel' onClick={() => props.setModalState(MODALS.NONE)}>
                        Cancel
                    </div>
                    <div className='button ok' onClick={handleSelect}>
                        OK
                    </div>
                </div>
            </div>
        </div>
    )
};

export default TakeAwayModalComponent;
