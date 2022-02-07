import React from "react";
import "../../assets/scss/pages/add-employee.scss";
import {ISettingField} from "../../constants/constant";
import GenericSettingForm from "./GenericSettingForm";
import {toast} from "react-toastify";
import MenuItemsBackendApiService from "../../services/menu-items-backend-api.service";
import {AddNewMenuCategoryFields} from "../../constants/menu-item.constant";

//@ts-ignore
const AddNewMenuCategory = ({changeNavigation}) => {

    const saveChanges = async (updatedFields: ISettingField[]) => {
        let payload: any = {};
        //Hit API call and redirect to whatever place
        updatedFields.map(field => {
            payload[field.fieldName] = field.value;
        })
        const res = await MenuItemsBackendApiService.createMenuCategory(payload);
        if (res.id) {
            toast.success(`${payload.name} Added to material list successfully!`)
        }
        changeNavigation();
    }

    return (
        <GenericSettingForm
            initialFields={AddNewMenuCategoryFields}
            onSaveChanges={saveChanges}
        />
    )
}

export default AddNewMenuCategory;
