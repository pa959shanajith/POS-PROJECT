import React, {useEffect, useState} from "react";
import "../../assets/scss/pages/add-employee.scss";
import {ISettingField} from "../../constants/constant";
import GenericSettingForm from "./GenericSettingForm";
import {toast} from "react-toastify";
import {EmailSetupPOSFields} from "../../constants/pos-setting.contants";
import EmailBackendApiService from "../../services/email-backend-api.service";

// @ts-ignore
const EmailSetupPOS = ({changeNavigation}) => {
    const [fields, setFields] = useState(EmailSetupPOSFields);
    const saveChanges = async (fields: ISettingField[]) => {
        const payload: any = {};
        fields.map(field => {
            payload[field.fieldName] = field.value
        });
        //Hit API call and redirect to whatever place
        const {message, success} = await EmailBackendApiService.updateEmailSetup({
            ...payload,
        });
        if (success) {
            toast.success(`Email config setup updated!`)
        } else {
            toast.error(message);
        }
        changeNavigation();
    }

    const getInitialData = async () => {
        const {success, data, message} = await EmailBackendApiService.getEmailSetup();
        if(success) {
            setFields(prevState => (
                prevState.map(prevField => ({
                    ...prevField,
                    value: data[prevField.fieldName]
                }))
            ));
        } else {
            toast.error(message);
        }
    }

    useEffect(() => {
        // Get all expenseCat
        getInitialData();
    }, []);

    return (
        <GenericSettingForm
            initialFields={fields}
            onSaveChanges={saveChanges}
        />
    )
}

export default EmailSetupPOS;
