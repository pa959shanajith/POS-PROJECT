import React, {useEffect, useState} from 'react';
import {Table} from "antd";
import Overlay from "../../assets/scss/components/Overlay";
import POSBackendApiService from "../../services/pos-backend-api.service";
import dayjs from "dayjs";
// @ts-ignore
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import AuthService from "../../services/auth.service";
import '../../assets/scss/components/sales-report.scss';
import {FixedType} from "rc-table/lib/interface";
import {getNumber} from "../../services/generic.service";

// @ts-ignore
const SalesReportComponent = ({changeNavigation}) => {
    const [dataSource, setDataSource] = useState([]);
    const [sessionDataRes, setSessionDataRes] = useState([]);

    const [totalBilledAmount, setTotalBilledAmount] = useState(0);
    const [onlineOrderCount, setOnlineOrderCount] = useState(0);
    const [takeAwayCount, setTakeAwayCount] = useState(0);
    const [dineInCount, setDineInCount] = useState(0);

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
            title: 'Bill Number',
            dataIndex: 'billNumber',
            key: 'billNumber',
            sorter: (a: any, b: any) => {
                [a, b] = [a.id, b.id];
                if (a === b) {
                    return 0
                } else {
                    return a > b ? 1 : -1
                }
            },
            width: 90,
            fixed: 'left' as FixedType,
        },
        {
            title: 'Order Type',
            dataIndex: 'orderType',
            width: 60,
            sorter: (a: any, b: any) => {
                [a, b] = [a.orderType, b.orderType];
                if (a === b) {
                    return 0
                } else {
                    return a > b ? 1 : -1
                }
            },
            fixed: 'left' as FixedType,
            key: 'orderType',
        },
        {
            title: 'Order Name',
            dataIndex: 'orderName',
            width: 90,
            sorter: (a: any, b: any) => {
                [a, b] = [a.orderName, b.orderName];
                if (a === b) {
                    return 0
                } else {
                    return a > b ? 1 : -1
                }
            },
            fixed: 'left' as FixedType,
            key: 'orderName',
        },
        {
            title: 'Customer Info',
            dataIndex: 'customerInfo',
            width: 90,
            sorter: (a: any, b: any) => {
                [a, b] = [a.customerInfo, b.customerInfo];
                if (a === b) {
                    return 0
                } else {
                    return a > b ? 1 : -1
                }
            },
            key: 'customerInfo',
            render: (val: any) => val || '-',
        },
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
            title: 'Date (DD-MMM-YYYY HH:mm:ss)',
            dataIndex: 'date',
            key: 'date',
            sorter: (a: any, b: any) => {
                [a, b] = [a.date, b.date];
                if (a === b) {
                    return 0
                } else {
                    return a > b ? 1 : -1
                }
            },
            width: 100,
            // fixed: 'left' as FixedType,
        },
        {
            title: 'Payment Mode',
            dataIndex: 'paymentMethod',
            width: 60,
            sorter: (a: any, b: any) => {
                [a, b] = [a.paymentMethod, b.paymentMethod];
                if (a === b) {
                    return 0
                } else {
                    return a > b ? 1 : -1
                }
            },
            key: 'paymentMethod',
        },
        {
            title: 'Total Price',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            sorter: (a: any, b: any) => {
                [a, b] = [getNumber(a.totalPrice), getNumber(b.totalPrice)];
                if (a === b) {
                    return 0
                } else {
                    return a > b ? 1 : -1
                }
            },
            width: 60,
        },
        {
            title: 'Bill Items',
            key: 'billItems',
            sorter: true,
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

    const getCustomerInfoString = (customer: any) => {
        let val = '';
        if (customer){
            if (customer.name) {
                val = `Name: ${customer.name}`;
            }
            if (customer.phoneNumber) {
                val = val ? `${val}, Phone: ${customer.phoneNumber}` : `Phone: ${customer.phoneNumber}` ;
            }
            if (customer.vehicleNumber) {
                val = val ? `${val}, Vehicle: ${customer.vehicleNumber}` : `Vehicle: ${customer.vehicleNumber}`;
            }
        }
        return val;
    }

    const createDataSource = async () => {
        let [currOnlineCount, currTakeAwayCount, currDineInCount] = [0,0,0];
        const billingDataRes = await POSBackendApiService.fetchAllBillingItems({
            startDate,
            endDate,
            sessionId: selectedSession,
        });

        let localDataSource: any[] = [];
        let totalPrice = 0;
        if (billingDataRes.success) {
            billingDataRes.data?.map((bill: any, idx: number) => {
                if (bill.orderType === 'DINE_IN') {
                    currOnlineCount++;
                } else if (bill.orderType === 'TAKE_AWAY') {
                    currTakeAwayCount++;
                } else if (bill.orderType === 'ONLINE_ORDER') {
                    currDineInCount++
                }
                localDataSource.push({
                    serialNum: idx+1,
                    id: bill.id,
                    billNumber: bill.billNumber,
                    date: dayjs(bill.createdAt).format('DD-MMM-YYYY HH:mm:ss'),
                    paymentMethod: bill.methodOfPayment,
                    orderType: bill.orderType,
                    orderName: bill.orderName,
                    personsCount: bill.orderMetaData.personsCount,
                    totalPrice: bill.totalAmount,
                    customerInfo: getCustomerInfoString(bill.Customer),
                    billItems: bill.menuItems?.map((billItem: any) => {
                        return {
                            name: billItem.name,
                            qty: billItem.qty,
                            sellingPrice: billItem.sellingPrice
                        }
                    }),
                    isVisible: true,
                });
                totalPrice += bill.totalAmount;
            });
            setDataSource([...localDataSource]);
            setDineInCount(currDineInCount);
            setOnlineOrderCount(currOnlineCount);
            setTakeAwayCount(currTakeAwayCount);
            setTotalBilledAmount(totalPrice);
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

    const renderFooter = () => {
        return (
            <div className='table-footer-cont'>
                <div className='order-count-container'>
                    <h1 className='order-count'> Online Orders: <b>{onlineOrderCount}</b> </h1>
                    <h1 className='order-count'> Take-away Orders: <b>{takeAwayCount}</b> </h1>
                    <h1 className='order-count'> Dine-in Orders: <b>{dineInCount}</b> </h1>
                </div>
                <div>
                    {totalBilledAmount
                        ? <h1>Total Billed Amount <span className={'total-price-value'}>{totalBilledAmount}</span></h1>
                        : <h1>No Bills found!</h1>}
                </div>
            </div>
        )
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
                    <span>View Sales Report</span>
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
                    footer={renderFooter}
                />
            </div>
        </Overlay>
    )

}

export default SalesReportComponent

