import React, {useEffect, useState} from 'react';
import {Table} from "antd";
import Overlay from "../../assets/scss/components/Overlay";
import StockBackendApiService from "../../services/stock-backend-api.service";
import {toast} from "react-toastify";
import dayjs from "dayjs";
import "../../assets/scss/components/stock-report-component.scss";
import DatePicker from "react-datepicker";

// @ts-ignore
const ViewStockReportComponent = ({changeNavigation}) => {
    const [dataSource, setDataSource] = useState([]);
    const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));

    const [filterField, setFilterField] = useState('');
    const [filterText, setFilterText] = useState('');

    const columns = [
        {
            title: 'S.No.',
            dataIndex: 'serialNum',
            key: 'serialNum',
        },
        {
            title: 'Name',
            dataIndex: 'materialName',
            sorter: (a: any, b: any) => {
                [a, b] = [a.materialName, b.materialName];
                if (a === b) {
                    return 0
                } else {
                    return a > b ? 1 : -1
                }
            },
            key: 'materialName',
        },
        {
            title: 'Store name',
            dataIndex: 'storeName',
            sorter: (a: any, b: any) => {
                [a, b] = [a.storeName, b.storeName];
                if (a === b) {
                    return 0
                } else {
                    return a > b ? 1 : -1
                }
            },
            key: 'storeName',
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
            title: 'Price',
            dataIndex: 'price',
            sorter: (a: any, b: any) => {
                [a, b] = [a.price, b.price];
                if (a === b) {
                    return 0
                } else {
                    return a > b ? 1 : -1
                }
            },
            key: 'price',
        },
        {
            title: 'Stock Present',
            dataIndex: 'stocksPresent',
            sorter: (a: any, b: any) => {
                [a, b] = [a.stocksPresent, b.stocksPresent];
                if (a === b) {
                    return 0
                } else {
                    return a > b ? 1 : -1
                }
            },
            key: 'stocksPresent',
        },
        {
            title: 'Current Stock',
            dataIndex: 'currentStock',
            sorter: (a: any, b: any) => {
                [a, b] = [a.currentStock, b.currentStock];
                if (a === b) {
                    return 0
                } else {
                    return a > b ? 1 : -1
                }
            },
            key: 'currentStock',
        },
        {
            title: 'Last updated',
            dataIndex: 'lastUpdated',
            sorter: (a: any, b: any) => {
                [a, b] = [a.lastUpdated, b.lastUpdated];
                if (a === b) {
                    return 0
                } else {
                    return a > b ? 1 : -1
                }
            },
            key: 'lastUpdated',
        },
    ];

    const onClose = () => {
        changeNavigation();
    }

    useEffect(() =>{
        createDataSource()
    }, [date]);

    const createDataSource = async () => {
        if (!date) {
            toast.error('Please select a date to get the stock details!')
            return;
        }
        const {success, message, data: stockRes} = await StockBackendApiService.fetchStockListDetails({date});
        console.log(stockRes);
        if (success) {
            let localDataSource = stockRes.map((rec: any, idx:number) => {
                return {
                    serialNum: idx + 1,
                    key: rec.id,
                    materialName: rec.Stock?.materialName,
                    stocksPresent: rec.updatedStock,
                    units: rec.Stock?.units,
                    price: rec.price,
                    storeName: rec.Stock?.Store?.name,
                    currentStock: rec.Stock?.currentStock,
                    lastUpdated: dayjs(rec.createdAt).format('MM-DD-YYYY :: HH:mm:ss A'),
                    isVisible: true,
                }
            });
            setDataSource([...localDataSource]);
        } else {
            toast.error(message);
        }
    }

    const filterSearchResults = () => {
        setDataSource(dataSource.map((ds: any) =>  ({
            ...ds,
            isVisible: typeof ds[filterField] === 'string' ? ds[filterField].toLowerCase().includes(filterText.toLowerCase()) : ds[filterField] == filterText,
        })))
    }

    const resetSearchResults = () => {
        setFilterField('');
        setFilterText('');
        setDataSource(dataSource.map((ds: any) =>  ({
            ...ds,
            isVisible: true
        })))
    }

    return (
        <Overlay closeOverlay={onClose}>
            <div className="sales-report-container stock-report-container">
                <div className="page-heading">
                    <span>View Stock List Report</span>
                </div>
                <div className='filters j-space-bet'>
                    <div className='filters-text'>Search Stocks:</div>
                    <div className='date-range'>
                        <DatePicker
                            onChange={(date) => { setDate(dayjs(date as Date).format('YYYY-MM-DD'))}}
                            maxDate={dayjs().toDate()}
                            selected={dayjs(date, 'YYYY-MM-DD').toDate()} // FORMAT MUST BE YYYY-MM-DD
                        />
                        <select
                            name={'filterField'}
                            value={filterField}
                            onChange={({target}) => setFilterField(target.value)}
                        >
                            <option>Select an option</option>
                            {
                                ['materialName', 'price', 'units', 'storeName']
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
                    scroll={{ x: 1500, y: 500 }}
                />
            </div>
        </Overlay>
    )

}

export default ViewStockReportComponent;

