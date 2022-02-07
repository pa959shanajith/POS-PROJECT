import React, {useEffect, useState} from "react";
import "../../assets/scss/pages/add-employee.scss";
import {ISettingField} from "../../constants/constant";
import GenericSettingForm from "./GenericSettingForm";
import {toast} from "react-toastify";
import MaterialBackendApiService from "../../services/material-backend-api.service";
import {EditMaterialFields} from "../../constants/material.constants";

//@ts-ignore
const EditMaterialComponent = ({changeNavigation}) => {

    const [fields, setFields] = useState(EditMaterialFields);
    const [materialsData, setMaterialsData] = useState([]);
    const [selectedMaterial, setSelectedMaterial] = useState()

    const saveChanges = async (updatedFields: ISettingField[]) => {
        const payload: any = {}
        updatedFields.map(field => {
            payload[field.fieldName] = field.value
        });
        //Hit API call and redirect to whatever place
        const {success, message} = await MaterialBackendApiService.updateMaterial({
            ...payload,
        });
        if (success) {
            toast.success(`${payload.name} updated successfully!`)
        } else {
            toast.error(message || 'Something went wrong while updating the material!')
        }
        changeNavigation();
    }

    const getAllMaterials = async () => {
        const {data : materialsResData} = await MaterialBackendApiService.fetchAllMaterials();
        const materialsData: any = materialsResData.map((role: any) => {
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
                        data: materialsData,
                    }
                } else {
                    return prevField;
                }
            });
        });
        setMaterialsData(materialsResData);
    }

    const onChangeEventHandler = (e: any) => {
        if (e.target.name === 'id') {
            setSelectedMaterial(e.target.value)
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
        getAllMaterials();
    }, []);

    useEffect(() => {
        let currentStoreObj: any = {};
        materialsData.some((materialItem: any) => {
            if (materialItem.id === selectedMaterial) {
                currentStoreObj = materialItem;
                return true;
            }
            return false;
        });
        setFields((prevFields: any) => {
            return prevFields.map((prevField: any) => {
                if (prevField.fieldName === 'id') {
                    return {
                        ...prevField,
                        value: selectedMaterial,
                    }
                } else  {
                    return {
                        ...prevField,
                        value: currentStoreObj[prevField.fieldName]
                    };
                }
            })
        });
    }, [selectedMaterial]);

    return (
        <GenericSettingForm
            initialFields={fields}
            onSaveChanges={saveChanges}
            onChangeEvent={onChangeEventHandler}
        />
    )
}

export default EditMaterialComponent;
