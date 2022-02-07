import React, {useEffect, useState} from 'react';
import {Table} from "antd";
import Overlay from "../../assets/scss/components/Overlay";
import dayjs from "dayjs";
import "../../assets/scss/components/material-purchase-report-component.scss"
// @ts-ignore
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import '../../assets/scss/components/sales-report.scss';
import {FixedType} from "rc-table/lib/interface";
import {toast} from "react-toastify";
import StockBackendApiService from "../../services/stock-backend-api.service";
import {getNumber} from "../../services/generic.service";

// @ts-ignore
const ViewMaterialPurchaseComponentReport = ({changeNavigation}) => {
    const [dataSource, setDataSource] = useState([]);

    const [startDate, setStartDate] = useState<any>();
    const [endDate, setEndDate] = useState<any>();

    const [filterField, setFilterField] = useState('');
    const [filterText, setFilterText] = useState('');

    const columns = [
        {
            title: 'S No.',
            dataIndex: 'serialNum',
            key: 'serialNum',
            width: 80,
            fixed: 'left' as FixedType,
            render: (val: any) => (<b>{val}</b>)
        },
        {
            title: 'Material Name',
            dataIndex: 'name',
            sorter: (a: any, b: any) => {
                [a, b] = [a.name, b.name];
                if (a === b) {
                    return 0
                } else {
                    return a > b ? 1 : -1
                }
            },
            key: 'name',
        },
        {
            title: 'Store',
            dataIndex: 'store',
            sorter: (a: any, b: any) => {
                [a, b] = [a.store, b.store];
                if (a === b) {
                    return 0
                } else {
                    return a > b ? 1 : -1
                }
            },
            key: 'store',
        },
        {
            title: 'Units',
            dataIndex: 'units',
            sorter: (a: any, b: any) => {
                [a, b] = [a.units, b.units];
                if (a === b) {
                    return 0
                } else {
                    return a > b ? 1 : -1
                }
            },
            key: 'units',
        },
        {
            title: 'Stocks Purchase',
            dataIndex: 'stockChangeQuantity',
            sorter: (a: any, b: any) => {
                [a, b] = [getNumber(a.stockChangeQuantity), getNumber(b.stockChangeQuantity)];
                if (a === b) {
                    return 0
                } else {
                    return a > b ? 1 : -1
                }
            },
            key: 'stockChangeQuantity',
        },
        {
            title: 'Current Price/Unit',
            dataIndex: 'price',
            sorter: (a: any, b: any) => {
                [a, b] = [getNumber(a.price), getNumber(b.price)];
                if (a === b) {
                    return 0
                } else {
                    return a > b ? 1 : -1
                }
            },
            key: 'price',
        },
        {
            title: 'Total price spent',
            dataIndex: 'totalPrice',
            sorter: (a: any, b: any) => {
                [a, b] = [getNumber(a.totalPrice), getNumber(b.totalPrice)];
                if (a === b) {
                    return 0
                } else {
                    return a > b ? 1 : -1
                }
            },
            key: 'totalPrice',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            sorter: (a: any, b: any) => {
                [a, b] = [a.description, b.description];
                if (a === b) {
                    return 0
                } else {
                    return a > b ? 1 : -1
                }
            },
            key: 'description',
        },
    ];

    const onClose = () => {
        changeNavigation();
    }

    useEffect(() => {
        createDataSource();
    }, [startDate, endDate]);

    const createDataSource = async () => {
        if (!startDate || !endDate) {
            setDataSource([])
            return;
        }
        const {
            success,
            data: purchasedMaterials,
            message
        } = await StockBackendApiService.fetchMaterialPurchaseList({startDate, endDate});
        if (success) {
            let localDataSource = purchasedMaterials.map((purchaseRecord: any, idx: number) => {
                return {
                    serialNum: idx + 1,
                    key: purchaseRecord.MenuItemId,
                    name: purchaseRecord.Stock?.materialName,
                    price: purchaseRecord.Stock?.price,
                    totalPrice: +purchaseRecord.price * +purchaseRecord.stockChangeQuantity,
                    units: purchaseRecord.Stock?.units,
                    store: purchaseRecord.Stock?.Store?.name,
                    stockChangeQuantity: purchaseRecord.stockChangeQuantity,
                    description: purchaseRecord.notes,
                    isVisible: true,
                }
            });

            setDataSource([...localDataSource]);
        } else {
            toast.error(message);
        }
    }

    const handleRangePicker = (values: any) => {
        if (!values) {
            setStartDate(undefined);
            setEndDate(undefined);
        } else {
            setStartDate(dayjs(values[0]).format('YYYY-MM-DD'))
            setEndDate(dayjs(values[1]).format('YYYY-MM-DD'))
        }
    }

    const filterSearchResults = () => {
        setDataSource(dataSource.map((ds: any) => ({
            ...ds,
            isVisible: typeof ds[filterField] === 'string' ? ds[filterField].toLowerCase().includes(filterText.toLowerCase()) : ds[filterField] == filterText,
        })))
    }

    const resetSearchResults = () => {
        setFilterField('');
        setFilterText('');
        setDataSource(dataSource.map((ds: any) => ({
            ...ds,
            isVisible: true
        })))
    }

    return (
        <Overlay closeOverlay={onClose}>
            <div className={'sales-report-container material-purchase-report-component'}>
                <div className="page-heading">
                    <span>Material Purchase</span>
                </div>
                <div className='filters j-space-bet'>
                    <div className='filters-text'>Filters:</div>
                    <div className='date-range'>
                        <DateRangePicker
                            onChange={handleRangePicker}
                            value={[startDate, endDate]}
                        />
                        <select
                            name={'filterField'}
                            value={filterField}
                            onChange={({target}) => setFilterField(target.value)}
                        >
                            <option>Select an option</option>
                            {
                                ['name', 'price', 'totalPrice', 'units', 'store', 'stockChangeQuantity', 'description']
                                    .map((dataItem: any) => {
                                        return (
                                            <option value={dataItem}
                                                    selected={dataItem === filterField}>{dataItem.toUpperCase()}</option>
                                        )
                                    })
                            }
                        </select>
                        <input name={'filterText'}
                               type='text'
                               className='input'
                               value={filterText}
                               placeholder={'Filter Text'}
                               onChange={(e) => setFilterText(e.target.value)}
                        />
                        <div className='button search' onClick={filterSearchResults}>Search</div>
                        <div className='button reset' onClick={resetSearchResults}>Reset</div>

                    </div>
                </div>
                <Table
                    dataSource={dataSource.filter(ds => ds.isVisible)}
                    columns={columns}
                    pagination={false}
                    scroll={{x: 1500, y: 500}}
                />
            </div>
        </Overlay>
    )
}

export default ViewMaterialPurchaseComponentReport

