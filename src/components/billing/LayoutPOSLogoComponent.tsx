import React from "react";
import POS_DEFAULT_LOGO from "../../assets/images/pos-logo.jpeg";
import {useSelector} from "react-redux";

const LayoutPOSLogoComponent = () => {
    const {shopLogo} = useSelector((state: any) => {
        return {
            shopLogo: state.posState.basicPosData.logo
        }
    })
    return (
        <div className={'logo-container'}>
            <img src={shopLogo || POS_DEFAULT_LOGO} alt="logo"/>
        </div>
    )
}

export default LayoutPOSLogoComponent;
