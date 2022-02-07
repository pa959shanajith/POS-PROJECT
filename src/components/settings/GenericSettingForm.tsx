import React, {useEffect, useState} from "react";
import "../../assets/scss/pages/add-employee.scss";
import InputField from "../base/InputField";
import {ISettingField} from "../../constants/constant";

interface IGenericSettingForm {
    initialFields: ISettingField[];
    onSaveChanges: (fields: ISettingField[]) => void; // return the key value pair form here!!
    onChangeEvent?: (e: any) => void;
    addMoreGroupItem?: (payload: any) => void;
}

const GenericSettingForm = ({ initialFields, onSaveChanges, onChangeEvent = (e) => {} }: IGenericSettingForm) => {

    const [fields, setFields] = useState<any>(initialFields);

    useEffect(() => {
        setFields(initialFields);
    }, [initialFields]);

    const onChangeHandler = (e: any) => {
        const updatedFields = fields.map((field: any) => {
            if (field.fieldName === e.target.name) {
                return {
                    ...field,
                    value: field.type === 'checkbox' ? e.target.checked : e.target.value,
                }
            } else {
                return field;
            }
        });
        setFields([...updatedFields]);
        onChangeEvent(e);
    }

    const fileInputFieldChange = (data: {fieldName: string, file: File}) => {
        const updatedFields = fields.map((field: any) => {
            if (field.fieldName === data.fieldName) {
                return {
                    ...field,
                    value: data.file,
                }
            } else {
                return field;
            }
        });
        setFields([...updatedFields]);
    }

    return (
        <div className="pos-blue-box-cont">
            { fields.map((field: any) => {
                return <InputField
                    field={field}
                    onChangeHandler={onChangeHandler}
                    fileInputFieldChange={fileInputFieldChange}
                />
            })}
            <div className="button-container" onClick={() => onSaveChanges(fields)}>
                <span className="button">SAVE</span>
            </div>
        </div>
    )
}

export default GenericSettingForm;
