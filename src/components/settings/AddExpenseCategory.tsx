import React from "react";
import "../../assets/scss/pages/add-employee.scss";
import {ISettingField} from "../../constants/constant";
import GenericSettingForm from "./GenericSettingForm";
import {toast} from "react-toastify";
import ExpenseBackendApiService from "../../services/expense-backend-api.service";
import {AddExpenseCategoryFields} from "../../constants/expense.constants";

//@ts-ignore
const AddExpenseCategory = ({changeNavigation}) => {

    const saveChanges = async (updatedFields: ISettingField[]) => {
        let payload: any = {};
        //Hit API call and redirect to whatever place
        updatedFields.map(field => {
            payload[field.fieldName] = field.value;
        })
        const res = await ExpenseBackendApiService.createExpenseCategory(payload);
        if (res.id) {
            toast.success(`${payload.name} Added to material list successfully!`)
        }
        changeNavigation();
    }

    return (
        <GenericSettingForm
            initialFields={AddExpenseCategoryFields}
            onSaveChanges={saveChanges}
        />
    )
}

export default AddExpenseCategory;
