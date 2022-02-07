import React from 'react';
import Overlay from "../../assets/scss/components/Overlay";

const AreYouSurePopupComponent = ({ cancelConfirmation, doneConfirmation, title, doneTitle = 'Yes', cancelTitle = 'Cancel'}: any) => {
    return (
        <Overlay closeOverlay={cancelConfirmation}>
            <div className="are-you-sure-container">
                <div className="are-you-sure-container-header">
                    <h2>{title}</h2>
                </div>
                <div className={'button-container'}>
                    <div className={'button'} onClick={doneConfirmation}>{doneTitle}</div>
                    <div className={'red-button button'} onClick={cancelConfirmation}>{cancelTitle}</div>
                </div>
            </div>
        </Overlay>
    )
}

export default AreYouSurePopupComponent;
