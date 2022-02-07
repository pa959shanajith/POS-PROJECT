import React from 'react';
import './overlay.scss';

export interface IOverlayProps {
    closeOverlay: () => void;
    children: any;
}

const Overlay = (props: IOverlayProps) => {

    return (
        <div className={'overlay'}>
            <div className={'close-cont'} onClick={props.closeOverlay}>
                <span>X</span>
            </div>
            <div className={'overlay-main'}>
                {props.children}
            </div>
        </div>
    )

}

export default Overlay;

