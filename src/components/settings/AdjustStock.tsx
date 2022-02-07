import React, {useEffect, useState} from "react";
import "../../assets/scss/pages/add-employee.scss";
import {ISettingField} from "../../constants/constant";
import {toast} from "react-toastify";
import StockBackendApiService from "../../services/stock-backend-api.service";
import InputField from "../base/InputField";
import {AdjustStockFields} from "../../constants/stock.constants";

//@ts-ignore
const AdjustStockComponent = ({changeNavigation}) => {

    const [fields, setFields] = useState(AdjustStockFields);
    const [allStockData, setAllStockData] = useState([]);
    const [selectedStockId, setSelectedStockId] = useState()

    const saveChanges = async (updatedFields: ISettingField[]) => {
        const payload: any = {};
        updatedFields.map(field => {
            if (!field.disabled) {
                payload[field.fieldName] = field.value
            }
        });
        //Hit API call and redirect to whatever place
        const res = await StockBackendApiService.adjustStock({
            ...payload,
        });
        if (res.success) {
            toast.success(`${payload.materialName} adjusted successfully!`)
            changeNavigation();
        } else {
            toast.error(res.message);
        }
    }

    const getAllStocks = async () => {
        const {data: stockRes} = await StockBackendApiService.fetchAllStocks();

        const stocksData: any = stockRes.map((stock: any) => {
            return {
                value: stock.id,
                label: `[${stock.materialName}] - ${stock.Store.name}`,
                stockId: stock.id
                // Add a field to make it not selectable
            }
        });
        console.log(stockRes);
        setFields((prevFields: any) => {
            return prevFields.map((prevField: any) => {
                if (prevField.fieldName === 'id') {
                    return {
                        ...prevField,
                        data: stocksData,
                    }
                } else if (prevField.fieldName === 'currentStock') {
                    return {
                        ...prevField,
                        value: 0,
                    }
                } else {
                    return prevField;
                }
            })
        });
        setAllStockData(stockRes);
    }

    const onChangeEventHandler = (e: any) => {
        if (e.target.name === 'id') {
            setSelectedStockId(e.target.value)
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
        getAllStocks();
    }, []);

    useEffect(() => {
        let currentStock = 0;
        let units = '';
        allStockData.some((stocks: any) => {
            if (stocks.id === selectedStockId) {
                currentStock = stocks.currentStock;
                units = stocks.units;
                return true;
            }
            return false;
        });
        setFields((prevFields: any) => {
            return prevFields.map((prevField: any) => {
                if (prevField.fieldName === 'id') {
                    return {
                        ...prevField,
                        value: selectedStockId,
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
                } else  {
                    return prevField;
                }
            })
        });
    }, [selectedStockId]);

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

export default AdjustStockComponent;
