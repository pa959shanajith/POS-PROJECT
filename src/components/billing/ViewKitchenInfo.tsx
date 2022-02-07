import React, {useState} from 'react';

const ViewKitchenInfo = ({ item, handleUpdate }: { item: any, handleUpdate: (text: string) => void })=>{
    const [kitchenInfo, setKitchenInfo] = useState(item.kitchenInfo);
    const saveChanges = () => {
        handleUpdate(kitchenInfo);
    }

    return (
        <div className="kitchen-info-container">
            <div className="kitchen-header">
                <h2>Notes To Kitchen</h2>
                {item.sentToKitchen && <h3>[Sent to Kitchen]</h3>}
            </div>
            <div className="kitchen-content">
                <h2>{ item.name }</h2>
                <div className="kitchen-text-input">
                    <textarea
                        value={kitchenInfo}
                        onChange={(e) => setKitchenInfo(e.target.value)}
                        disabled={item.sentToKitchen}
                    />
                </div>
                <div className="button-container">
                    <input
                        className="button"
                        type="button"
                        value="OK"
                        disabled={item.sentToKitchen}
                        onClick={saveChanges}
                    />
                </div>
            </div>
        </div>
    )
};

export default ViewKitchenInfo;
