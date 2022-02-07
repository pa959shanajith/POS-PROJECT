import React, {useState} from "react";
import "../../assets/scss/pages/clock-selection.scss";
import Layout from "../base/Layout";
import {useHistory} from "react-router-dom";
import {ArrowRightOutlined} from "@ant-design/icons";
import LayoutPOSLogoComponent from "../billing/LayoutPOSLogoComponent";
import AuthService from "../../services/auth.service";
import {useDispatch, useSelector} from "react-redux";
import {userActions} from "../../reducers/user-reducer";
import {toast} from "react-toastify";

const ClockSessionComponent = () => {
    const [showSecondaryOption, setShowSecondaryOption] = useState<boolean>(false);
    const history = useHistory();
    const dispatch = useDispatch();
    const { sessionId } = useSelector((state: any) => {
        return {
            sessionId: state.posState.sessionId,
        }
    })
    const clockOption = [{
        id: 'clockIn',
        title: 'Clock In',
        description: 'Starting the day :)',
    }, {
        id: 'clockOut',
        title: 'Clock Out',
        description: 'Done for the day :)'
    }, {
        id: 'billing',
        title: 'Billing',
        description: 'Continue billing'
    },]

    const secondaryOptions = [
        {
            id: 'clockInExit',
            title: 'Exit',
            description: 'Start with some other work',
        }, {
            id: 'clockInBilling',
            title: 'Billing',
            description: 'Start billing',
        }
    ]

    const handleOptionClick = (itemId: string) => {
        if (itemId === 'clockIn') {
            // Call API to add the clock in time
            AuthService.clockIn().then((data: any) => {
                if (data.success) {
                    setShowSecondaryOption(true);
                }
            });
        } else if (itemId === 'clockOut') {
            // Call API to update the clock out time
            AuthService.clockOut().then(async (data: any) => {
                if (data.success) {
                    // Log out the user
                    dispatch({ type: userActions.LOG_OUT });
                    history.push('/employee-login');
                } else {
                    toast.error(data.message)
                }
            });

        } else if (itemId === 'billing' || itemId === 'clockInBilling') {
            history.push(sessionId ? '/billing' : '/start-session');
        } else if (itemId === 'clockInExit') {
            // Log out the user
            dispatch({ type: userActions.LOG_OUT });
            history.push('/employee-login');
        }
    }

    return(
        <Layout pageHeading="Clock Selection" isCentered={true} topRightChildElement={LayoutPOSLogoComponent}>
            <div className='clock-selection'>
                <div className='selection-container'>
                    <h2 className='title'>Please choose an option to proceed</h2>
                    <div className='option-container'>
                        {
                            showSecondaryOption ? (
                                secondaryOptions.map((option: any, idx: number) => {
                                    return (
                                        <div className='option-card' onClick={() => handleOptionClick(option.id)}>
                                            <h6 className='option-num'>#{idx + 1}</h6>
                                            <h6>{option.title}</h6>
                                            <p>{option.description}</p>
                                            <div className='button'>Choose &#8594;</div>
                                        </div>
                                    )
                                })
                            ) : (
                                clockOption.map((option: any, idx: number) => {
                                    return (
                                        <div className='option-card' onClick={() => handleOptionClick(option.id)}>
                                            <h6 className='option-num'>#{idx + 1}</h6>
                                            <h6>{option.title}</h6>
                                            <p>{option.description}</p>
                                            <div className='button'><span>Choose</span><ArrowRightOutlined /></div>
                                        </div>
                                    )
                                })
                            )
                        }
                    </div>
                </div>
            </div>
        </Layout>
    );
};
export default ClockSessionComponent;
