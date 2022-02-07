import React, {useEffect, useState} from 'react';
import {Table} from "antd";
import Overlay from "../../assets/scss/components/Overlay";
import dayjs from "dayjs";
// @ts-ignore
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import AuthService from "../../services/auth.service";
import '../../assets/scss/components/attendance-report.scss'
import {FixedType} from "rc-table/lib/interface";
import DatePicker from "react-datepicker";

// @ts-ignore
const AttendanceReportComponent = ({changeNavigation}) => {
    const [dataSource, setDataSource] = useState([]);
    const [startDate, setStartDate] = useState<any>(dayjs().add(-30, 'days').format('YYYY-MM-DD'));
    const [endDate, setEndDate] = useState<any>(dayjs().format('YYYY-MM-DD'));

    const [filterField, setFilterField] = useState('');
    const [filterText, setFilterText] = useState('');

    const columns = [
        {
            title: 'S.No.',
            dataIndex: 'serialNum',
            key: 'serialNum',
            width: 5,
            fixed: 'left' as FixedType,
        },
        {
            title: 'Employee Name',
            dataIndex: 'employeeName',
            sorter: (a: any, b: any) => {
                [a, b] = [a.employeeName, b.employeeName];
                if (a === b) {
                    return 0
                } else {
                    return a > b ? 1 : -1
                }
            },
            key: 'employeeName',
            width: 20,
            fixed: 'left' as FixedType,
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
            width: 10,
        },
        {
            title: 'Clocked in at',
            dataIndex: 'clockIn',
            sorter: (a: any, b: any) => {
                [a, b] = [a.clockIn, b.clockIn];
                if (a === b) {
                    return 0
                } else {
                    return a > b ? 1 : -1
                }
            },
            key: 'clockIn',
            width: 20
        },
        {
            title: 'Clocked out at',
            dataIndex: 'clockOut',
            sorter: (a: any, b: any) => {
                [a, b] = [a.clockedOut, b.clockedOut];
                if (a === b) {
                    return 0
                } else {
                    return a > b ? 1 : -1
                }
            },
            key: 'clockOut',
            width: 20
        },
    ];
    const onClose = () => {
        changeNavigation();
    }

    useEffect(() => {
        createDataSource();
    }, [startDate, endDate]);


    const createDataSource = async () => {
        const attendanceRes = await AuthService.getAttendance({ startDate, endDate });

        if (attendanceRes.success) {
            const localDataSource = attendanceRes.data.map((dataPoint: any, idx: number) => {
                return {
                    serialNum: idx+1,
                    clockIn: dayjs(dataPoint.clockInTime).format('YYYY-MM-DD:HH:mm:ss'),
                    clockOut: dataPoint.clockOutTime ? dayjs(dataPoint.clockOutTime).format('YYYY-MM-DD:HH:mm:ss') : 'Still Clocked In',
                    employeeName: dataPoint.Employee?.name,
                    date: dayjs(dataPoint.createdAt).format('YYYY-MM-DD'),
                    isVisible: true,
                }
            })
            setDataSource([...localDataSource]);
        }
    }

    const handleRangePicker = (values: any) => {
        if (!values) {
            setStartDate(dayjs().add(-30, 'days').format('YYYY-MM-DD'));
            setEndDate(dayjs().format('YYYY-MM-DD'));
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
            <div className={'attendance-report-container'}>
                <div className="page-heading">
                    <span>View Attendance Report</span>
                </div>
                <div className='filters'>
                    <div className='filters-text'>Filters: </div>
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
                                ['employeeName', 'date']
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
                    scroll={{ x: 1000, y: 500 }}
                />
            </div>
        </Overlay>
    )
}

export default AttendanceReportComponent
