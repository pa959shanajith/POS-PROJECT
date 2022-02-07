import React from "react";
import "../../assets/scss/pages/add-employee.scss";
import {ISettingField} from "../../constants/constant";
import GenericSettingForm from "./GenericSettingForm";
import {toast} from "react-toastify";
import StoreBackendApiService from "../../services/store-backend-api.service";
import {AddNewStoreFields} from "../../constants/store.constants";
//@ts-ignore
const AddNewStore = ({changeNavigation}) => {

    const saveChanges = async (fields: ISettingField[]) => {
        const payload: any = {};
        fields.map(field => {
            payload[field.fieldName] = field.value
        });
        //Hit API call and redirect to whatever place
        const res = await StoreBackendApiService.createStore({
            ...payload,
        });
        if (res.id) {
            toast.success(`${payload.name} Added As A Store successfully!`)
        }
        changeNavigation();
    }

    return (
        <GenericSettingForm
            initialFields={AddNewStoreFields}
            onSaveChanges={saveChanges}
        />
    )
}

export default AddNewStore;
