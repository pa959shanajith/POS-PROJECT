import React, {useEffect, useState} from "react";
import "../../assets/scss/pages/add-employee.scss";
import {ISettingField} from "../../constants/constant";
import {toast} from "react-toastify";
import InputField from "../base/InputField";
import ExpenseBackendApiService from "../../services/expense-backend-api.service";
import {message} from "antd";
import {EditExpenseFields} from "../../constants/expense.constants";

//@ts-ignore
const EditExpenseComponent = ({changeNavigation, ...rest}) => {

    const [fields, setFields] = useState(EditExpenseFields);
    const [allExpenseData, setAllExpenseData] = useState([]);
    const [expenseItemId, setExpenseItemId] = useState(null);
    const [selectedExpItemCategoryId, setSelExpItemCategoryId] = useState()

    const saveChanges = async (updatedFields: ISettingField[]) => {
        const payload: any =  expenseItemId ? {
            id: expenseItemId
        } : {};
        updatedFields.map(field => {
            if (!field.disabled) {
                payload[field.fieldName] = field.value
            }
        });
        //Hit API call and redirect to whatever place
        const res = await ExpenseBackendApiService.updateExpenseItem({
            ...payload,
        });
        if (res.id) {
            toast.success(`${payload.name} updated successfully!`)
        }
        changeNavigation();
    }

    const getAllExpensesData = async () => {
        const expenseResData = await ExpenseBackendApiService.fetchALlExpenseItems();
        const expenseData: any = expenseResData.map((expense: any) => {
            return {
                value: expense.id,
                label: `[${expense.ExpenseCategory.name}] ${expense.description}`,
            }
        });

        setFields((prevFields: any) => {
            return prevFields.map((prevField: any) => {
                if (prevField.fieldName === 'expenseCategoryId') {
                    return {
                        ...prevField,
                        data: expenseData,
                    }
                } else {
                    return prevField;
                }
            })
        });
        setAllExpenseData(expenseResData);
        // Check if we have something already selected from parent element.... this view is coming up from view tables
        if (rest.id && rest.description){
            onChangeEventHandler({
                target: {
                    name: 'expenseCategoryId',
                    value: rest.id,
                }
            });
            message.info(`Expense with description "${rest.description}" UNDER "${rest.category}" category selected for edit!`)
        }
    }

    const onChangeEventHandler = (e: any) => {
        console.log(e.target.name, e.target.value);
        if (e.target.name === 'expenseCategoryId') {
            setSelExpItemCategoryId(e.target.value);
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
        getAllExpensesData();
    }, []);

    useEffect(() => {
        console.log('iinnnn', selectedExpItemCategoryId)
        let currentExpenseObj: any = {};
        allExpenseData.some((expenseItem: any) => {
            if (expenseItem.id === selectedExpItemCategoryId) {
                currentExpenseObj = expenseItem;
                setExpenseItemId(expenseItem.id);
                return true;
            }
            return false;
        });
        setFields((prevFields: any) => {
            return prevFields.map((prevField: any) => {
                if (prevField.fieldName === 'expenseCategoryId') {
                    return {
                        ...prevField,
                        value: selectedExpItemCategoryId,
                    }
                } else  {
                    return {
                        ...prevField,
                        value: currentExpenseObj[prevField.fieldName]
                    };
                }
            })
        });
    }, [selectedExpItemCategoryId]);

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
