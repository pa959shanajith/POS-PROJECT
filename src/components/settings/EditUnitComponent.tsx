import React, {useEffect, useState} from "react";
import "../../assets/scss/pages/add-employee.scss";
import {ISettingField} from "../../constants/constant";
import GenericSettingForm from "./GenericSettingForm";
import {toast} from "react-toastify";
import UnitBackendApiService from "../../services/unit-backend-api.service";
import {EditUnitFields} from "../../constants/material.constants";

//@ts-ignore
const EditUnitComponent = ({changeNavigation}) => {

    const [fields, setFields] = useState(EditUnitFields);
    const [unitsData, setUnitsData] = useState([]);
    const [selectedUnit, setSelectedUnit] = useState()

    const saveChanges = async (updatedFields: ISettingField[]) => {
        const payload: any = {}
        updatedFields.map(field => {
            payload[field.fieldName] = field.value
        });
        //Hit API call and redirect to whatever place
        const {success, message} = await UnitBackendApiService.updateUnit({
            ...payload,
        });
        if (success) {
            toast.success(`${payload.name} updated successfully!`)
        } else {
            toast.error(message || 'Something went wrong while updating the unit!')
        }
        changeNavigation();
    }

    const getAllUnits = async () => {
        const {data : unitsResData} = await UnitBackendApiService.fetchAllUnits();
        const unitsData: any = unitsResData.map((role: any) => {
            return {
                value: role.id,
                label: role.name,
            }
        });
        setFields((prevFields: any) => {
            return prevFields.map((prevField: any) => {
                if (prevField.fieldName === 'id') {
                    return {
                        ...prevField,
                        data: unitsData,
                    }
                } else {
                    return prevField;
                }
            });
        });
        setUnitsData(unitsResData);
    }

    const onChangeEventHandler = (e: any) => {
        if (e.target.name === 'id') {
            setSelectedUnit(e.target.value)
        } else {
            // Loop over fields to attach the values
            const updatedFields: any = fields.map((field: any) => {
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
        getAllUnits();
    }, []);

    useEffect(() => {
        let currentStoreObj: any = {};
        unitsData.some((unitItem: any) => {
            if (unitItem.id === selectedUnit) {
                currentStoreObj = unitItem;
                return true;
            }
            return false;
        });
        setFields((prevFields: any) => {
            return prevFields.map((prevField: any) => {
                if (prevField.fieldName === 'id') {
                    return {
                        ...prevField,
                        value: selectedUnit,
                    }
                } else  {
                    return {
                        ...prevField,
                        value: currentStoreObj[prevField.fieldName]
                    };
                }
            })
        });
    }, [selectedUnit]);

    return (
        <GenericSettingForm
            initialFields={fields}
            onSaveChanges={saveChanges}
            onChangeEvent={onChangeEventHandler}
        />
    )
}

export default EditUnitComponent;
