import React from "react";
import "../../assets/scss/pages/add-employee.scss";
import {ISettingField} from "../../constants/constant";
import GenericSettingForm from "./GenericSettingForm";
import POSBackendApiService from "../../services/pos-backend-api.service";
import {toast} from "react-toastify";
import {BillTemplatePOSFields} from "../../constants/pos-setting.contants";

//@ts-ignore
const BillTemplatePOS = ({changeNavigation}) => {

    const saveChanges = async (updatedFields: ISettingField[]) => {
        const payload: any = {};
        //Hit API call and redirect to whatever place
        updatedFields.map(field => {
            payload[field.fieldName] = field.value;
        });
        const res = await POSBackendApiService.billTemplate(payload);
        if (res.id) {
            toast.success(`Bill Template Added Successfully!`);
        }
        changeNavigation();
    }

    return (
        <GenericSettingForm
            initialFields={BillTemplatePOSFields}
            onSaveChanges={saveChanges}
        />
    )
}

export default BillTemplatePOS;
