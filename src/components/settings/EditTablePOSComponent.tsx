import React, {useEffect, useState} from "react";
import "../../assets/scss/pages/add-employee.scss";
import {ISettingField} from "../../constants/constant";
import POSBackendApiService from "../../services/pos-backend-api.service";
import {toast} from "react-toastify";
import InputField from "../base/InputField";
import {EditTablePOSFields} from "../../constants/pos-setting.contants";

// @ts-ignore
const EditTablePOSComponent = ({changeNavigation}) => {
    const [fields, setFields] = useState(EditTablePOSFields);
    const [allTablesData, setAllTablesData] = useState([]);
    const [selectedTable, setSelectedTable] = useState()

    const saveChanges = async (updatedFields: ISettingField[]) => {
        const payload: any = {};
        //Hit API call and redirect to whatever place
        updatedFields.map(field => {
            payload[field.fieldName] = field.value;
        });
        const { data, success, message } = await POSBackendApiService.editTable(payload);
        if (success) {
            toast.success(`Shop details Updated Successfully!`);
            changeNavigation();
        } else {
            toast.error(message);
        }
    }

    const onChangeEventHandler = (e: any) => {
        if (e.target.name === 'id') {
            setSelectedTable(e.target.value);
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

    const getAllInitialData = async () => {
        const {data: allTableRes, success, message} = await POSBackendApiService.fetchAllTables();
        if (success) {
            const tablesOptionData: any = allTableRes.map((table: any) => {
                return {
                    value: table.id,
                    label: table.name,
                }
            });

            setFields((prevFields: any) => {
                return prevFields.map((prevField: any) => {
                    if (prevField.fieldName === 'id') {
                        return {
                            ...prevField,
                            data: tablesOptionData,
                        }
                    } else {
                        return prevField;
                    }
                })
            });
            setAllTablesData(allTableRes);
        } else {
            toast.error(message);
        }
    }

    useEffect(() => {
        // Get all roles
        getAllInitialData();
    }, []);

    useEffect(() => {
        let selectedTableObj: any = {};
        allTablesData.some((table: any) => {
            if (table.id === selectedTable) {
                 selectedTableObj= table;
                return true;
            }
            return false;
        });
        setFields((prevFields: any) => {
            return prevFields.map((prevField: any) => {
                if (prevField.fieldName === 'id') {
                    return {
                        ...prevField,
                        value: selectedTable,
                    }
                } else  {
                    return {
                        ...prevField,
                        value: selectedTableObj[prevField.fieldName]
                    };
                }
            })
        });
    }, [selectedTable]);

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

export default EditTablePOSComponent;
