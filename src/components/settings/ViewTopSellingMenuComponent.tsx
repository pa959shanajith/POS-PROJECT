import React, {useEffect, useState} from 'react';
import {Checkbox, Table} from "antd";
import Overlay from "../../assets/scss/components/Overlay";
import dayjs from "dayjs";
import "../../assets/scss/components/top-selling-menu-component.scss";
// @ts-ignore
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import '../../assets/scss/components/sales-report.scss';
import {FixedType} from "rc-table/lib/interface";
import MenuItemsBackendApiService from "../../services/menu-items-backend-api.service";
import {toast} from "react-toastify";

// @ts-ignore
const ViewTopSellingMenuComponent = ({changeNavigation}) => {
    const [dataSource, setDataSource] = useState([]);

    const [startDate, setStartDate] = useState<any>();
    const [endDate, setEndDate] = useState<any>();

    const [filterField, setFilterField] = useState('');
    const [filterText, setFilterText] = useState('');

    const columns = [
        {
            title: 'Ranking.',
            dataIndex: 'serialNum',
            key: 'serialNum',
            width: 100,
            fixed: 'left' as FixedType,
            render: (val: any) => (<b>{val}</b>)
        },
        {
            title: 'Name',
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
            width: 150,
            fixed: 'left' as FixedType,
        },
        {
            title: 'Arabic Name',
            dataIndex: 'arabicName',
            sorter: (a: any, b: any) => {
                [a, b] = [a.arabicName, b.arabicName];
                if (a === b) {
                    return 0
                } else {
                    return a > b ? 1 : -1
                }
            },
            key: 'arabicName',
            width: 130,
            fixed: 'left' as FixedType,
        },
        {
            title: 'Quantity Sold',
            dataIndex: 'quantity',
            sorter: (a: any, b: any) => {
                [a, b] = [a.quantity, b.quantity];
                if (a === b) {
                    return 0
                } else {
                    return a > b ? 1 : -1
                }
            },
            key: 'quantity',
            width: 130,
            fixed: 'left' as FixedType,
            render: (val: any) => (<b>{val}</b>)
        },
        {
            title: 'Category',
            dataIndex: 'categoryName',
            sorter: (a: any, b: any) => {
                [a, b] = [a.categoryName, b.categoryName];
                if (a === b) {
                    return 0
                } else {
                    return a > b ? 1 : -1
                }
            },
            key: 'categoryName',
            width: 120,
        },
        {
            title: 'Materials',
            key: 'materials',
            width: 300,
            dataIndex: 'materials',
            render: (materials: any) => {
                return materials.map((material: any) => {
                    return (
                        <div className={'action-tag edit-action '}>
                            {material?.materialName?.substr(0, 10)} : <b>{material?.quantity}</b>
                        </div>
                    )
                })
            },
        },
        {
            title: 'Selling Price',
            dataIndex: 'sellingPrice',
            sorter: (a: any, b: any) => {
                [a, b] = [a.sellingPrice, b.sellingPrice];
                if (a === b) {
                    return 0
                } else {
                    return a > b ? 1 : -1
                }
            },
            key: 'sellingPrice',
            width: 130,
        },
        {
            title: 'Printer 1',
            dataIndex: 'printer1',
            key: 'printer1',
            width: 120,
            render: (value: any) => (
                <Checkbox
                    className={'table-checkbox'}
                    checked={!!value}
                />
            ),
        },
        {
            title: 'Printer 2',
            dataIndex: 'printer2',
            key: 'printer2',
            width: 120,
            render: (value: any) => (
                <Checkbox
                    className={'table-checkbox'}
                    checked={!!value}
                />
            ),
        },
        {
            title: 'Printer 3',
            dataIndex: 'printer3',
            key: 'printer3',
            width: 120,
            render: (value: any) => (
                <Checkbox
                    className={'table-checkbox'}
                    checked={!!value}
                />
            ),
        },
        {
            title: 'BarCode',
            dataIndex: 'barCode',
            sorter: (a: any, b: any) => {
                [a, b] = [a.barCode, b.barCode];
                if (a === b) {
                    return 0
                } else {
                    return a > b ? 1 : -1
                }
            },
            key: 'barCode',
            width: 140,
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
            data: topMenuItemsData,
            message
        } = await MenuItemsBackendApiService.fetchTopSellingItems({startDate, endDate});
        if (success) {
            let localDataSource = topMenuItemsData.sort((a: any, b: any) => +a.quantity < +b.quantity ? 1 : -1).map((menuCat: any, idx: number) => {
                return {
                    serialNum: idx + 1,
                    key: menuCat.MenuItemId,
                    name: menuCat.MenuItem.name,
                    arabicName: menuCat.MenuItem.arabicName,
                    quantity: menuCat.quantity,
                    categoryName: menuCat.MenuItem.MenuItemCategory.name,
                    materials: menuCat.MenuItem.materials,
                    sellingPrice: menuCat.MenuItem.sellingPrice,
                    printer1: menuCat.MenuItem.printer1,
                    printer2: menuCat.MenuItem.printer2,
                    printer3: menuCat.MenuItem.printer3,
                    barCode: menuCat.MenuItem.barCode,
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
            <div className={'sales-report-container top-selling-menu-component'}>
                <div className="page-heading">
                    <span>Top Selling Menu</span>
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
                                ['name', 'arabicName', 'quantity', 'categoryName', 'sellingPrice', 'barCode']
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
                    dataSource={dataSource.filter((d: any) => d.isVisible)}
                    columns={columns}
                    pagination={false}
                    scroll={{x: 1500, y: 500}}
                />
            </div>
        </Overlay>
    )
}

export default ViewTopSellingMenuComponent

