import React, {useEffect, useState} from "react";
import "../../assets/scss/pages/add-employee.scss";
import {ISettingField} from "../../constants/constant";
import GenericSettingForm from "./GenericSettingForm";
import {toast} from "react-toastify";
import MenuItemsBackendApiService from "../../services/menu-items-backend-api.service";
import {EditMenuCategoryFields} from "../../constants/menu-item.constant";

//@ts-ignore
const EditMenuCategoryComponent = ({changeNavigation}) => {
    const [fields, setFields] = useState(EditMenuCategoryFields);
    const [categoriesData, setCategoriesData] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState();

    const saveChanges = async (updatedFields: ISettingField[]) => {
        let payload: any = {};
        //Hit API call and redirect to whatever place
        updatedFields.map(field => {
            payload[field.fieldName] = field.value;
        })
        const res = await MenuItemsBackendApiService.updateMenuCategory(payload);
        if (res.id) {
            toast.success(`${payload.name} Added to material list successfully!`)
        }
        changeNavigation();
    }

    const getAllCategories = async () => {
        const {data: categoriesRes} = await MenuItemsBackendApiService.fetchAllMenuCategories();
        let categoriesData = categoriesRes?.map((dataItem: any) => {
            return {
                value: dataItem.id,
                label: dataItem.name,
            }
        });
        const updatedFields = fields.map(field => {
            if (field.fieldName === 'id') {
                return {
                    ...field,
                    data: categoriesData,
                }
            } else {
                return field;
            }
        });
        setFields(updatedFields);
        setCategoriesData(categoriesRes);
    }

    const onChangeEventHandler = (e: any) => {
        if (e.target.name === 'id') {
            setSelectedCategoryId(e.target.value)
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
        getAllCategories();
    }, []);

    useEffect(() => {
        let currentStoreObj: any = {};
        categoriesData.some((categoryItem: any) => {
            if (categoryItem.id === selectedCategoryId) {
                currentStoreObj = categoryItem;
                return true;
            }
            return false;
        });
        setFields((prevFields: any) => {
            return prevFields.map((prevField: any) => {
                if (prevField.fieldName === 'id') {
                    return {
                        ...prevField,
                        value: selectedCategoryId,
                    }
                } else  {
                    return {
                        ...prevField,
                        value: currentStoreObj[prevField.fieldName]
                    };
                }
            })
        });
    }, [selectedCategoryId]);

    return (
        <GenericSettingForm
            initialFields={fields}
            onSaveChanges={saveChanges}
            onChangeEvent={onChangeEventHandler}
        />
    )
}

export default EditMenuCategoryComponent;
