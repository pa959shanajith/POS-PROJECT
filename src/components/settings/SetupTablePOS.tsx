import React from "react";
import "../../assets/scss/pages/add-employee.scss";
import {ISettingField} from "../../constants/constant";
import GenericSettingForm from "./GenericSettingForm";
import POSBackendApiService from "../../services/pos-backend-api.service";
import {toast} from "react-toastify";
import {SetupTablePOSFields} from "../../constants/pos-setting.contants";

// @ts-ignore
const SetupTablePOS = ({changeNavigation}) => {

    const saveChanges = async (updatedFields: ISettingField[]) => {
        const payload: any = {};
        //Hit API call and redirect to whatever place
        updatedFields.map(field => {
            payload[field.fieldName] = field.value;
        });
        const res = await POSBackendApiService.addTable(payload);
        if (res.name) {
            toast.success(`Shop details Updated Successfully!`);
        }
        changeNavigation();
    }

    return (
        <GenericSettingForm
            initialFields={SetupTablePOSFields}
            onSaveChanges={saveChanges}
        />
    )
}

export default SetupTablePOS;
