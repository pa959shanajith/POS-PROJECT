import React, {useEffect, useState} from "react";
import "../../assets/scss/pages/add-employee.scss";
import {ISettingField} from "../../constants/constant";
import GenericSettingForm from "./GenericSettingForm";
import {toast} from "react-toastify";
import StoreBackendApiService from "../../services/store-backend-api.service";
import {message} from "antd";
import {EditStoreFields} from "../../constants/store.constants";

//@ts-ignore
const EditStoreComponent = ({changeNavigation, ...rest}) => {
    const [fields, setFields] = useState(EditStoreFields);
    const [allStoreData, setAllStoreData] = useState([]);
    const [selectedStore, setSelectedStore] = useState()

    const saveChanges = async (updatedFields: ISettingField[]) => {
        const payload: any = {}
        updatedFields.map(field => {
            payload[field.fieldName] = field.value
        });
        //Hit API call and redirect to whatever place
        const res = await StoreBackendApiService.updateStore({
            ...payload,
        });
        if (res.id) {
            toast.success(`${payload.name} updated successfully!`)
        }
        changeNavigation();
    }

    const getAllStores = async () => {
        const {data: res} = await StoreBackendApiService.fetchAllStore();
        const storesData: any = res.map((role: any) => {
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
                        data: storesData,
                    }
                } else {
                    return prevField;
                }
            })
        });
        setAllStoreData(res);
        // Check if we have something already selected from parent element.... this view is coming up from view tables
        if (rest.id && rest.name){
            onChangeEventHandler({
                target: {
                    name: 'id',
                    value: rest.id,
                }
            });
            message.info(`${rest.name} store selected for edit!`)
        }
    }

    const onChangeEventHandler = (e: any) => {
        if (e.target.name === 'id') {
            setSelectedStore(e.target.value);
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
        getAllStores();
    }, []);


    useEffect(() => {
        let currentStoreObj: any = {};
        allStoreData.some((storeItem: any) => {
            if (storeItem.id === selectedStore) {
                currentStoreObj = storeItem;
                return true;
            }
            return false;
        });
        setFields((prevFields: any) => {
            return prevFields.map((prevField: any) => {
                if (prevField.fieldName === 'id') {
                    return {
                        ...prevField,
                        value: selectedStore,
                    }
                } else  {
                    return {
                        ...prevField,
                        value: currentStoreObj[prevField.fieldName]
                    };
                }
            })
        });
    }, [selectedStore]);

    return (
        <GenericSettingForm
            initialFields={fields}
            onSaveChanges={saveChanges}
            onChangeEvent={onChangeEventHandler}
        />
    )
}

export default EditStoreComponent;
