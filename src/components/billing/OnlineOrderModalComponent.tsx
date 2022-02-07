import React, {useState} from 'react';
import {MODALS} from "./BillingFooterContent";
import {toast} from "react-toastify";

interface IOnlineOrderModalPropsType{
    selectOnlinePlatform: Function;
    setModalState: Function;
}

const OnlineOrderModalComponent = (props:IOnlineOrderModalPropsType) => {
    const [selectedOnlinePlatform, setSelectedOnlinePlatform] = useState<any>('');

    const handleSelect = () => {
        if (selectedOnlinePlatform) { // Check if its just a empty object
            props.selectOnlinePlatform(selectedOnlinePlatform);
            props.setModalState(MODALS.NONE);
        } else {
            toast.error('Please select an online platform!');
        }
    }



    return(
        <div className="select-table-container">
            <div className="select-table-container-header">
                <h2>Online Order</h2>
            </div>
            <div className="select-table-container-content">
                <div className="tables">
                    {
                        ['Zomato', 'Uber Eats', 'Talabat', 'Rafeeq'].map(platform => (
                            <div key={platform} onClick={ () => setSelectedOnlinePlatform(platform)} className={`table ${selectedOnlinePlatform === platform ? 'selected' : ''}`}>
                                {platform}
                            </div>
                        ))
                    }
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

export default OnlineOrderModalComponent;
