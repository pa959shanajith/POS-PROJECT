import React, {useEffect, useState} from "react";
import "../../assets/scss/pages/add-employee.scss";
import {ISettingField} from "../../constants/constant";
import {toast} from "react-toastify";
import StockBackendApiService from "../../services/stock-backend-api.service";
import InputField from "../base/InputField";
import StoreBackendApiService from "../../services/store-backend-api.service";
import {MoveStockFields} from "../../constants/stock.constants";

//@ts-ignore
const MoveStockComponent = ({changeNavigation}) => {

    const [fields, setFields] = useState(MoveStockFields);
    const [stockOptions, setStockOptions] = useState([]);
    const [allStockData, setAllStockData] = useState([]);
    const [allStoresData, setAllStoresData] = useState([]);
    const [storeToMoveStock, setStoreToMoveStock] = useState('');
    const [storeFromMoveStock, setStoreFromMoveStock] = useState('');
    const [selectedStockId, setSelectedStockId] = useState()

    const saveChanges = async (updatedFields: ISettingField[]) => {
        const payload: any = {};
        updatedFields.map(field => {
            if (!field.disabled) {
                payload[field.fieldName] = field.value
            }
        });
        //Hit API call and redirect to whatever place
        const res = await StockBackendApiService.moveStock({
            ...payload,
        });
        if (res.success) {
            toast.success(`${res.data?.materialName} moved successfully!`)
            changeNavigation();
        } else {
            toast.error(res.message);
        }
    }

    const getAllStocks = async () => {
        const {data: stockRes} = await StockBackendApiService.fetchAllStocks();
        const {data: storeRes} = await StoreBackendApiService.fetchAllStore();

        const stockOptionsData: any = stockRes.map((stock: any) => {
            return {
                value: stock.id,
                label: stock.materialName,
                stockId: stock.id,
                storeId: stock.Store.id,
                hideOption: false,
                // Add a field to make it not selectable
            }
        });

        const storesData:any = storeRes.map((store: any) => {
            return {
                value: store.id,
                label: store.name,
            }
        });

        setFields((prevFields: any) => {
            return prevFields.map((prevField: any) => {
                if (prevField.fieldName === 'selectedStock') {
                    return {
                        ...prevField,
                        data: stockOptionsData,
                    }
                } else if (['moveToStore', 'moveFromStore'].includes(prevField.fieldName)) {
                    return {
                        ...prevField,
                        data: storesData,
                    }
                } else if (['currentStockA', 'currentStockB'].includes(prevField.fieldName)) {
                    return {
                        ...prevField,
                        value: 0,
                    }
                } else {
                    return prevField;
                }
            })
        });
        setStockOptions(stockOptionsData);
        setAllStockData(stockRes);
        setAllStoresData(storeRes);
    }

    const onChangeEventHandler = (e: any) => {
        const { name: fieldName, value: fieldValue } = e.target;
        if (fieldName === 'selectedStock') {
            // setSelectedMaterial(e.target.value)
            // Make the selected store non selectable for the move to store
            setSelectedStockId(fieldValue)
        } else if (fieldName === 'moveToStore') {
            // Update the current stock value
            setStoreToMoveStock(fieldValue)
        } else if (fieldName === 'moveFromStore') {
            // Update the current stock value
            setStoreFromMoveStock(fieldValue)
        }  else {
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
        let currentStockB = 0;
        let selectedMaterialName = ''
        allStockData.map(stock => {
            if (stock.id === selectedStockId) {
                selectedMaterialName = stock.materialName;
            }
        })
        allStockData.map(stock => {
            if (stock.StoreId === storeToMoveStock && stock.materialName === selectedMaterialName){
                currentStockB = stock.currentStock;
            }
        })
        setFields((prevFields: any) => {
            return prevFields.map((prevField: any) => {
                if (prevField.fieldName === 'moveToStore') {
                    return {
                        ...prevField,
                        value: storeToMoveStock,
                    }
                } else if (prevField.fieldName === 'currentStockB') {
                    return {
                        ...prevField,
                        value: currentStockB,
                    }
                } else  {
                    return prevField;
                }
            })
        })
    }, [storeToMoveStock])

    useEffect(() => {
        setFields((prevFields: any) => {
            return prevFields.map((prevField: any) => {
                if (prevField.fieldName === 'selectedStock') {
                    return {
                        ...prevField,
                        data: stockOptions.map(stock => ({
                            ...stock,
                            hideOption: stock.storeId !== storeFromMoveStock
                        })),
                        value: '',
                    }
                } else  {
                    return prevField;
                }
            })
        });
    }, [storeFromMoveStock])

    useEffect(() => {
        let selectedStock: any = {};
        allStockData.some((stock: any) => {
            if (stock.id === selectedStockId) {
                selectedStock = stock
                return true;
            }
            return false;
        });

        // Make the store associated with this stock un selectable with moveToStore field
        const updatedStoreOptions = allStoresData.map(store => {
            console.log(store)
            return {
                value: store.id,
                label: store.name,
                disabledOption: store.id === selectedStock.StoreId
            }
        })
        console.log(updatedStoreOptions);
        setFields((prevFields: any) => {
            return prevFields.map((prevField: any) => {
                if (prevField.fieldName === 'selectedStock') {
                    return {
                        ...prevField,
                        value: selectedStockId,
                    }
                } else if (prevField.fieldName === 'currentStockA') {
                    return {
                        ...prevField,
                        value: selectedStock.currentStock,
                    }
                } else if (prevField.fieldName === 'units') {
                    return {
                        ...prevField,
                        value: selectedStock.units,
                    }
                } else if (prevField.fieldName === 'moveToStore') {
                    return {
                        ...prevField,
                        data: updatedStoreOptions,
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

export default MoveStockComponent;
