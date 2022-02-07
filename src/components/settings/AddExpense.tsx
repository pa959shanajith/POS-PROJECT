import React, {useEffect, useState} from "react";
import "../../assets/scss/pages/add-employee.scss";
import {ISettingField} from "../../constants/constant";
import GenericSettingForm from "./GenericSettingForm";
import ExpenseBackendApiService from "../../services/expense-backend-api.service";
import {toast} from "react-toastify";
import {AddExpenseFields} from "../../constants/expense.constants";

//@ts-ignore
const AddExpense = ({changeNavigation}) => {
    const [fields, setFields] = useState(AddExpenseFields);
    const [expenseCat, setExpenseCatData] = useState([]);

    const saveChanges = async (updatedFields: ISettingField[]) => {
        let payload: any = {};
        //Hit API call and redirect to whatever place
        updatedFields.map(field => {
            payload[field.fieldName] = field.value;
        })
        const res = await ExpenseBackendApiService.createExpense(payload);
        if (res.id) {
            toast.success(`Successfully added a new expense under ${res.ExpenseCategoryId} category`)
        }
        const resetFields = attachRolesDataToFields(AddExpenseFields, expenseCat);
        setFields([...resetFields]);
        // Finally call the change navigation method
        changeNavigation();
    }
    const attachRolesDataToFields = (fieldsData: ISettingField[], expenseCatData: any) => {
        return fieldsData.map(prevField => {
            if (prevField.fieldName === 'expenseCategoryId') {
                return {
                    ...prevField,
                    data: expenseCatData,
                }
            } else {
                return prevField;
            }
        });
    }


    const getExpenseCategory = async () => {
        const res = await ExpenseBackendApiService.fetchALlExpenseCategories();
        const expenseCatData: any = res.map((role: any) => {
            return {
                value: role.id,
                label: role.name,
            }
        });
        const updatedFields = attachRolesDataToFields(fields, expenseCatData);
        setExpenseCatData(expenseCatData);
        setFields([...updatedFields]);
    }

    useEffect(() => {
        // Get all expenseCat
        getExpenseCategory();
    }, []);


    return (
        <GenericSettingForm
            initialFields={fields}
            onSaveChanges={saveChanges}
        />
    )
}

export default AddExpense;
