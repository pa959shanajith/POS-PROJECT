import React, {useEffect, useState} from 'react';
import {Table} from "antd";
import Overlay from "../../assets/scss/components/Overlay";
import POSBackendApiService from "../../services/pos-backend-api.service";
import dayjs from "dayjs";
// @ts-ignore
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import AuthService from "../../services/auth.service";
import {FixedType} from "rc-table/lib/interface";
import {getNumber} from "../../services/generic.service";

// @ts-ignore
const VoidBillReportComponent = ({changeNavigation}) => {
    const [dataSource, setDataSource] = useState([]);
    const [sessionDataRes, setSessionDataRes] = useState([]);
    const [selectedSession, setSelectedSession] = useState<any>();
    const [startDate, setStartDate] = useState<any>();
    const [endDate, setEndDate] = useState<any>();

    const [filterField, setFilterField] = useState('');
    const [filterText, setFilterText] = useState('');

    const columns = [
        {
            title: 'S.No.',
            dataIndex: 'serialNum',
            key: 'serialNum',
            width: 40,
            fixed: 'left' as FixedType,
        },
        {
            title: 'Order Type',
            dataIndex: 'orderType',
            sorter: (a: any, b: any) => {
                [a, b] = [a.orderType, b.orderType];
                if (a === b) {
                    return 0
                } else {
                    return a > b ? 1 : -1
                }
            },
            width: 60,
            fixed: 'left' as FixedType,
            key: 'orderType',
        },
        {
            title: 'Order Name',
            dataIndex: 'orderName',
            sorter: (a: any, b: any) => {
                [a, b] = [a.orderName, b.orderName];
                if (a === b) {
                    return 0
                } else {
                    return a > b ? 1 : -1
                }
            },
            width: 90,
            fixed: 'left' as FixedType,
            key: 'orderName',
        },
        {
            title: 'Date',
            dataIndex: 'date',
            sorter: (a: any, b: any) => {
                [a, b] = [a.date, b.date];
                if (a === b) {
                    return 0
                } else {
                    return a > b ? 1 : -1
                }
            },
            key: 'date',
            width: 100,
        },
        // {
        //     title: 'Payment Mode',
        //     dataIndex: 'paymentMethod',
        //     sorter: (a: any, b: any) => { if (a === b) {return 0} else { return a > b ? 1 : -1} },
        //     key: 'paymentMethod',
        //     width: 60,
        // },
        {
            title: 'Persons Count',
            dataIndex: 'personsCount',
            width: 90,
            sorter: (a: any, b: any) => {
                [a, b] = [a.personsCount, b.personsCount];
                if (a === b) {
                    return 0
                } else {
                    return a > b ? 1 : -1
                }
            },
            key: 'personsCount',
            render: (val: number) => val || '-',
        },
        {
            title: 'Total Price',
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
            width: 60,
        },
        {
            title: 'Bill Items',
            key: 'billItems',
            width: 120,
            render: ({billItems}: any) => (
                <div className={'reports-bill-items'}>
                    {
                        billItems?.map((item: any) => {
                            return (
                                <>
                                    <div className={'item'}>
                                        <span className={"font-bold"}>{item.name}</span>
                                        <span>X {item.qty}</span>
                                        <span>@ {item.sellingPrice}</span>
                                    </div>
                                    <hr/>
                                </>
                            )
                        })
                    }
                </div>
            ),
        },
        {
            title: 'Notes',
            dataIndex: 'notes',
            sorter: (a: any, b: any) => {
                [a, b] = [a.notes, b.notes];
                if (a === b) {
                    return 0
                } else {
                    return a > b ? 1 : -1
                }
            },
            key: 'notes',
            width: 120,
        },
    ];
    const onClose = () => {
        changeNavigation();
    }

    useEffect(() => {
        createDataSource();
        updateSessionData();
    }, [startDate, endDate]);

    useEffect(() => {
        // Filter the data
        createDataSource();
    }, [selectedSession]);

    const updateSessionData = async () => {
        const sessionDataRes = await AuthService.fetchAllSessions({
            startDate,
            endDate,
        });
        setSessionDataRes(sessionDataRes.data);
    }

    const createDataSource = async () => {
        const billingDataRes = await POSBackendApiService.fetchAllBillingItems({
            startDate,
            endDate,
            sessionId: selectedSession,
            voided: true
        });

        let localDataSource: any[] = [];
        if (billingDataRes.success) {
            billingDataRes.data.map((bill: any, idx: number) => {
                localDataSource.push({
                    serialNum: idx+1,
                    orderType: bill.orderType,
                    orderName: bill.orderName,
                    date: dayjs(bill.createdAt).format('DD-MMM-YYYY'),
                    // paymentMethod: bill.methodOfPayment,
                    personsCount: bill.orderMetaData.personsCount,
                    notes: bill.notes,
                    totalPrice: bill.totalAmount,
                    billItems: bill.menuItems?.map((billItem: any) => {
                        return {
                            name: billItem.name,
                            qty: billItem.qty,
                            sellingPrice: billItem.sellingPrice
                        }
                    }),
                    isVisible: true,
                })
            });
            setDataSource([...localDataSource]);
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
            <div className={'sales-report-container sales-report-component'}>
                <div className="page-heading">
                    <span>View Void Bills</span>
                </div>
                <div className='filters jc-space-bet'>
                    <div className='filters-text'>Filters: </div>
                    <div className='date-range'>
                        <div className='filters-main-content'>
                            <DateRangePicker
                                onChange={handleRangePicker}
                                value={[startDate, endDate]}
                            />
                            <select
                                name={'session-select'}
                                value={selectedSession}
                                onChange={({target}) => setSelectedSession(target.value)}
                            >
                                <option>Select an option</option>
                                {
                                    sessionDataRes
                                        .map((dataItem: any) => {
                                            return (
                                                <option value={dataItem.id} selected={dataItem.id === selectedSession}>{dataItem.name}</option>
                                            )
                                        })
                                }
                            </select>
                            <div className='clear-session' onClick={() => setSelectedSession(undefined)}>X</div>
                            <select
                                name={'filterField'}
                                value={filterField}
                                onChange={({target}) => setFilterField(target.value)}
                            >
                                <option>Select an option</option>
                                {
                                    ['orderType', 'orderName', 'date', 'notes', 'totalPrice']
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
                        </div>
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

export default VoidBillReportComponent

