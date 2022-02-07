import React, {useEffect, useState} from "react";
import "../../assets/scss/pages/add-employee.scss";
import {ISettingField} from "../../constants/constant";
import GenericSettingForm from "./GenericSettingForm";
import {toast} from "react-toastify";
import POSBackendApiService from "../../services/pos-backend-api.service";
import storageService from "../../services/storageService";
import {posActions} from "../../reducers/pos-reducer";
import {useDispatch, useSelector} from "react-redux";
import StoreBackendApiService from "../../services/store-backend-api.service";
import {BasicSetupPOSFields} from "../../constants/pos-setting.contants";

//@ts-ignore
const BasicSetupPOS = ({changeNavigation}) => {
    const [fields, setFields] = useState(BasicSetupPOSFields);
    const dispatch = useDispatch();

    const {basicPosData} = useSelector((state: any) => {
        return {
            basicPosData: state.posState.basicPosData,
        }
    })

    const saveChanges = async (updatedFields: ISettingField[]) => {
        const shopId = storageService.getShopId();
        let fileData: any = '';
        //Hit API call and redirect to whatever place
        const formData = new FormData();
        formData.set('shopId', shopId);
        updatedFields.map(field => {
            if (field.fieldName === 'logo') {
                fileData = field.value
            } else {
                formData.set(field.fieldName, field.value as string);
            }
        });
        if (fileData) {
            formData.set('image',fileData);
        }
        const { data, success, message } = await POSBackendApiService.basicSetup(formData);
        if (success) {
            toast.success(`Shop details Updated Successfully!`);
            dispatch({
                type: posActions.INIT_BASIC_POS_DATA,
                payload: {
                    ...data,
                }
            });
            changeNavigation();
        } else {
            toast.error(message);
        }
    }

    useEffect(() => {
        // Get basic data
        initFormData();
    }, [])

    const initFormData = async () => {
        const {success, data: storesRes, message} = await StoreBackendApiService.fetchAllStore();
        let storesOptions: any = []
        if (success) {
            storesOptions = storesRes.map((store: any) => ({value: store.id, label: store.name}))
        } else {
            toast.error(message);
        }
        const updatedFields = fields.map((field: any) => {
            return {
                ...field,
                data: field.fieldName === 'storeId' ? storesOptions : field.data,
                value: basicPosData[field.fieldName],
            }
        });
        setFields(updatedFields);
    }

    return (
        <GenericSettingForm
            initialFields={fields}
            onSaveChanges={saveChanges}
        />
    )
}

export default BasicSetupPOS;
