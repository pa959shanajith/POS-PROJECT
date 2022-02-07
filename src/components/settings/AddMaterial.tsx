import React, {useEffect, useState} from "react";
import "../../assets/scss/pages/add-employee.scss";
import {ISettingField} from "../../constants/constant";
import GenericSettingForm from "./GenericSettingForm";
import MaterialBackendApiService from "../../services/material-backend-api.service";
import {toast} from "react-toastify";
import UnitBackendApiService from "../../services/unit-backend-api.service";
import {AddMaterialFields} from "../../constants/material.constants";

// @ts-ignore
const AddMaterial = ({changeNavigation}) => {
    const [fields, setFields] = useState(AddMaterialFields);
    const saveChanges = async (updatedFields: ISettingField[]) => {
        const payload: any = {};
        updatedFields.map(field => {
            payload[field.fieldName] = field.value
        });
        //Hit API call and redirect to whatever place
        const {message, success} = await MaterialBackendApiService.createMaterial({
            ...payload,
        });
        if (success) {
            toast.success(`${payload.name} Added to material list successfully!`)
        } else {
            toast.error(message);
        }
        changeNavigation();
    }

    useEffect(() => {
        // Get all expenseCat
        getInitialData();
    }, []);

    const getInitialData = async () => {
        const {success, data, message} = await UnitBackendApiService.fetchAllUnits();
        if (success){
            const unitsData: any = data.map((unit: any) => {
                return {
                    value: unit.shortForm,
                    label: unit.name,
                }
            });
            setFields(prevState => (
                prevState.map(prevField => {
                    if (prevField.fieldName === 'units') {
                        return {
                            ...prevField,
                            data: unitsData,
                        }
                    } else {
                        return prevField;
                    }
                })
            ));
        } else {
            toast.error(message);
        }
    }

    return (
        <GenericSettingForm
            initialFields={fields}
            onSaveChanges={saveChanges}
        />
    )
}

export default AddMaterial;
