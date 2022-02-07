import React from "react";
import "../../assets/scss/pages/add-employee.scss";
import {ISettingField} from "../../constants/constant";
import GenericSettingForm from "./GenericSettingForm";
import UnitBackendApiService from "../../services/unit-backend-api.service";
import {toast} from "react-toastify";
import {AddUnitFields} from "../../constants/material.constants";

// @ts-ignore
const AddUnitComponent = ({changeNavigation}) => {
    const saveChanges = async (fields: ISettingField[]) => {
        const payload: any = {};
        fields.map(field => {
            payload[field.fieldName] = field.value
        });
        //Hit API call and redirect to whatever place
        const {message, success} = await UnitBackendApiService.createUnit({
            ...payload,
        });
        if (success) {
            toast.success(`${payload.name} added to units list successfully!`)
        } else {
            toast.error(message);
        }
        changeNavigation();
    }

    return (
        <GenericSettingForm
            initialFields={AddUnitFields}
            onSaveChanges={saveChanges}
        />
    )
}

export default AddUnitComponent;
