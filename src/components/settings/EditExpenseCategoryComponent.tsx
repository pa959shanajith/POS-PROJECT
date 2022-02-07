import React, {useEffect, useState} from "react";
import ExpenseBackendApiService from "../../services/expense-backend-api.service";
import InputField from "../base/InputField";
import {ISettingField} from "../../constants/constant";
import {toast} from "react-toastify";
import "../../assets/scss/pages/add-employee.scss";
import {EditExpenseCategoryFields} from "../../constants/expense.constants";

//@ts-ignore
const EditExpenseComponent = ({changeNavigation}) => {

    const [fields, setFields] = useState(EditExpenseCategoryFields);
    const [allExpenseCategoryData, setAllExpenseCategoryData] = useState([]);
    const [selectedExpCategoryId, setSelExpCategoryId] = useState()

    const saveChanges = async (updatedFields: ISettingField[]) => {
        const payload: any = {};
        updatedFields.map(field => {
            if (!field.disabled) {
                payload[field.fieldName] = field.value
            }
        });
        //Hit API call and redirect to whatever place
        const res = await ExpenseBackendApiService.updateExpenseCategory({
            ...payload,
        });
        if (res.id) {
            toast.success(`${payload.name} category updated successfully!`)
        }
        changeNavigation();
    }

    const getAllExpensesCategoryData = async () => {
        const expenseCategoryResData = await ExpenseBackendApiService.fetchALlExpenseCategories();
        const expenseCategoryData: any = expenseCategoryResData.map((expense: any) => {
            return {
                value: expense.id,
                label: expense.name,
            }
        });

        setFields((prevFields: any) => {
            return prevFields.map((prevField: any) => {
                if (prevField.fieldName === 'id') {
                    return {
                        ...prevField,
                        data: expenseCategoryData,
                    }
                } else {
                    return prevField;
                }
            })
        });
        setAllExpenseCategoryData(expenseCategoryResData);
    }

    const onChangeEventHandler = (e: any) => {
        if (e.target.name === 'id') {
            setSelExpCategoryId(e.target.value);
        } else {
            const updatedFields = fields.map((field) => {
                if (field.fieldName === e.target.name) {
                    return {
                        ...field,
                        value: e.target.value,
                    }
                } else {
                    return field;
                }
            });
            setFields([...updatedFields]);
        }
    }
    useEffect(() => {
        // Get all roles
        getAllExpensesCategoryData();
    }, []);

    useEffect(() => {
        let currentExpenseCatObj: any = {};
        allExpenseCategoryData.some((expenseItem: any) => {
            if (expenseItem.id === selectedExpCategoryId) {
                currentExpenseCatObj = expenseItem;
                return true;
            }
            return false;
        });
        setFields((prevFields: any) => {
            return prevFields.map((prevField: any) => {
                if (prevField.fieldName === 'id') {
                    return {
                        ...prevField,
                        value: selectedExpCategoryId,
                    }
                } else  {
                    return {
                        ...prevField,
                        value: currentExpenseCatObj[prevField.fieldName]
                    };
                }
            })
        });
    }, [selectedExpCategoryId]);

    return (
        <div className="pos-blue-box-cont">
            {fields.map(field => {
                return <InputField
                    field={field}
                    onChangeHandler={onChangeEventHandler}
                />
            })}
            <div className="button-container" onClick={() => saveChanges(fields)}>
                <span className="button">SAVE</span>
            </div>
        </div>
    )
}

export default EditExpenseComponent;
