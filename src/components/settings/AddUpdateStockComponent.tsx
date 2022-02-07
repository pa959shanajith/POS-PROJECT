import React, {useEffect, useState} from "react";
import "../../assets/scss/pages/add-employee.scss";
import {ISettingField} from "../../constants/constant";
import {toast} from "react-toastify";
import StockBackendApiService from "../../services/stock-backend-api.service";
import MaterialBackendApiService from "../../services/material-backend-api.service";
import StoreBackendApiService from "../../services/store-backend-api.service";
import InputField from "../base/InputField";
import {AddUpdateStockFields} from "../../constants/stock.constants";

//@ts-ignore
const AddUpdateStockComponent = ({changeNavigation}) => {

    const [fields, setFields] = useState(AddUpdateStockFields);
    const [allMaterialData, setAllMaterialData] = useState([]);
    const [stockId, setStockId] = useState(null);
    const [allStockData, setAllStockData] = useState([]);
    const [selectedMaterial, setSelectedMaterial] = useState('')
    const [selectedStore, setSelectedStore] = useState()

    const saveChanges = async (updatedFields: ISettingField[]) => {
        const payload: any =  stockId ? {
            id: stockId,
        } : {};
        updatedFields.map(field => {
            if (!field.disabled || field.fieldName === 'units') {
                payload[field.fieldName] = field.value
            }
        });
        //Hit API call and redirect to whatever place
        const res = await StockBackendApiService.updateStock({
            ...payload,
        });
        if (res.success) {
            toast.success(`${payload.materialName} updated successfully!`)
            changeNavigation();
        } else {
            toast.error(res.message);
        }
    }

    const getAllMaterials = async () => {
        const {data: materialsResData} = await MaterialBackendApiService.fetchAllMaterials();
        const {data: storeRes} = await StoreBackendApiService.fetchAllStore();
        const {data: stockRes} = await StockBackendApiService.fetchAllStocks();
        const materialsData: any = materialsResData?.map((material: any) => {
            return {
                value: material.name, // why not material ID is accepted in Backend?
                label: material.name,
            }
        });
        const storesData:any = storeRes.map((role: any) => {
            return {
                value: role.id,
                label: role.name,
            }
        });

        setFields((prevFields: any) => {
            return prevFields.map((prevField: any) => {
                if (prevField.fieldName === 'materialName') {
                    return {
                        ...prevField,
                        data: materialsData,
                    }
                } else if (prevField.fieldName === 'storeId') {
                    return {
                        ...prevField,
                        data: storesData,
                    }
                } else {
                    return prevField;
                }
            })
        });
        setAllMaterialData(materialsResData);
        setAllStockData(stockRes);
    }

    const onChangeEventHandler = (e: any) => {
        if (e.target.name === 'materialName') {
            setSelectedMaterial(e.target.value) // NO need to loop over allMaterialData, as we just need the material name
        } else if (e.target.name === 'storeId') {
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
        getAllMaterials();
    }, []);

    useEffect(() => {
        let currentStock = 0;
        let selectedStockId = '';
        let units = '';
        let priceDiffForEmailAlert = '';
        allMaterialData.some(material => {
            if (material.name?.toLowerCase() === selectedMaterial?.toLowerCase()) {
                units = material.units;
                priceDiffForEmailAlert = material.priceDiffForEmailAlert;
                return true;
            } else {
              return false;
            }
        });

        allStockData.some((stocks: any) => {
            if (stocks.StoreId === selectedStore && stocks.materialName?.toLowerCase() === selectedMaterial?.toLowerCase()) {
                currentStock = stocks.currentStock;
                // Only update the stock if there is any stock corresponding to the material and store
                selectedStockId = stocks.id;
                return true;
            }
            return false;
        });

        setFields((prevFields: any) => {
            return prevFields.map((prevField: any) => {
                if (prevField.fieldName === 'materialName') {
                    return {
                        ...prevField,
                        value: selectedMaterial,
                    }
                } else if (prevField.fieldName === 'storeId') {
                    return {
                        ...prevField,
                        value: selectedStore,
                    }
                } else if (prevField.fieldName === 'currentStock') {
                    return {
                        ...prevField,
                        value: currentStock,
                    }
                } else if (prevField.fieldName === 'units') {
                    return {
                        ...prevField,
                        value: units,
                    }
                } else if (prevField.fieldName === 'priceDiffForEmailAlert') {
                    return {
                        ...prevField,
                        value: priceDiffForEmailAlert,
                    }
                } else  {
                    return prevField;
                }
            })
        });
        // Finally Update the stockId
        setStockId(selectedStockId);

    }, [selectedMaterial, selectedStore]);

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

export default AddUpdateStockComponent;
