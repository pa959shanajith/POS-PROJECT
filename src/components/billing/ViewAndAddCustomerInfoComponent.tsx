import React, {useEffect, useState} from 'react';
import {Table} from "antd";
import Overlay from "../../assets/scss/components/Overlay";
import {MODALS} from "./BillingFooterContent";
import POSBackendApiService from "../../services/pos-backend-api.service";
import {toast} from "react-toastify";
import '../../assets/scss/components/customer-info.scss'
import AreYouSurePopup from "../base/AreYouSurePopup";

const ViewAndAddCustomerInfoComponent = (props: any) => {
    const [dataSource, setDataSource] = useState<any[]>([]);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [columnsData, setColumnsData] = useState<any[]>([
        {
            title: 'S.No.',
            dataIndex: 'serialNum',
            key: 'serialNum',
        },
        {
            title: 'Customer Name',
            dataIndex: 'name',
            sorter: (a: any, b: any) => { if (a === b) {return 0} else { return a > b ? 1 : -1} },
            key: 'name',
        },
        {
            title: 'Phone No',
            dataIndex: 'phoneNumber',
            sorter: (a: any, b: any) => { if (a === b) {return 0} else { return a > b ? 1 : -1} },
            key: 'phoneNumber',
        },
        {
            title: 'Vehicle No',
            dataIndex: 'vehicleNumber',
            sorter: (a: any, b: any) => { if (a === b) {return 0} else { return a > b ? 1 : -1} },
            key: 'vehicleNumber',
        },
    ]);
    const [newCustomer, setNewCustomer] = useState({
        name: '',
        phoneNumber: '',
        vehicleNumber: ''
    });
    const [filterField, setFilterField] = useState('');
    const [filterText, setFilterText] = useState('');

    const handleDeleteModal = (row: any) => {
        if (row.isDeletable) {
            setSelectedRow(row);
            setShowDeleteModal(true);
        }
    }

    const handleAddToBill = (row: any) => {
        if (props.selectedOrderId) {
            setDataSource((ds: any) => {
                return ds.map((di: any) => ({
                    ...di,
                    attachedOrder: di.id === row.id
                        ? [...di.attachedOrder, props.selectedOrderId]
                        : di.attachedOrder.filter((attachedOrder: any) => attachedOrder !== props.selectedOrderId),
                }))
            })
            props.attachCustomerToOrder(row)
        } else {
            toast.error('No order is selected to attach customer with!')
        }
    }

    useEffect(() => {
        createDataSource();
        console.log('selectedOrderId', props.selectedOrderId)
        if (props.selectedOrderId) {
            setColumnsData( prevState => (
                [
                    ...prevState, {
                    title: 'Action',
                    key: 'action',
                    render: (dataRow: any) => (
                        <>
                            <div className={`action-tag info-action ${!props.selectedOrderId ? 'disabled' : '' }`} onClick={ () => handleAddToBill(dataRow)}>
                                {
                                    dataRow.attachedOrder.length
                                        ? 'Added to bill'
                                        : (props.selectedOrderId ? 'Add to active order' : 'No active order')
                                }
                            </div>
                            <div className={`action-tag delete-action ${!dataRow.isDeletable || dataRow.attachedOrder.length ? 'disabled' : '' }`} onClick={() => handleDeleteModal(dataRow)}>
                                {`${!dataRow.isDeletable || dataRow.attachedOrder.length ? 'Un-deletable' : 'Delete Customer'}`}
                            </div>
                        </>
                    )}
                ]
            ));
        }
    }, []);

    const fetchCustomerData = async () => {
        // const cachedEmployees = await db.table(TABLES.EMPLOYEES).toArray();
        // if (cachedEmployees.length) {
        //     return cachedEmployees;
        // }
        return await POSBackendApiService.fetchAllCustomers();
    }

    const createDataSource = async () => {
        const {data: customerData, success, message} = await fetchCustomerData();
        if (success) {
            let localDataSource: any = customerData.map((customer: any, idx: number) => {
                return {
                    serialNum: idx + 1,
                    id: customer.id,
                    key: customer.id,
                    name: customer.name,
                    phoneNumber: customer.phoneNumber,
                    vehicleNumber: customer.vehicleNumber,
                    isDeletable: customer.isDeletable,
                    attachedOrder: [],
                    isVisible: true,
                } as any;
            });
            setDataSource([...localDataSource]);
        } else {
            toast.error(message);
        }
    }

    const handleChangeEvent = (e: any) => {
        setNewCustomer(prevState => {
            return {
                ...prevState,
                [e.target.name]: e.target.value,
            }
        })
    }

    const addNewCustomer = async () => {
        const {success, data: newCustomerRes, message} = await POSBackendApiService.addNewCustomer(newCustomer);
        if (success) {
            // Add data to the table
            const updatedRows = [
                ...dataSource,
                {
                    id: newCustomerRes.id,
                    key: newCustomerRes.id,
                    serialNum: dataSource.length + 1,
                    name: newCustomerRes.name,
                    phoneNumber: newCustomerRes.phoneNumber,
                    vehicleNumber: newCustomerRes.vehicleNumber,
                    isDeletable: newCustomerRes.isDeletable,
                    attachedOrder: [],
                    isVisible: true,
                }
            ]
            setDataSource(updatedRows)

            // Reset the form fields
            setNewCustomer({
                name: '',
                phoneNumber: '',
                vehicleNumber: '',
            })

            // Show Taost message
            toast.success('Successfully added the new customer!');
        } else {
            toast.error(message);
        }
    }

    const getFooterComponent = () => {
        return (
            <div className='footer'>
                <div className='footer-text'>Add New Customer:</div>
                <div className='fields'>
                    <input name={'name'} type='text' value={newCustomer.name} placeholder={'Name'}
                           onChange={handleChangeEvent}/>
                    <input name={'phoneNumber'} type='text' value={newCustomer.phoneNumber} placeholder={'Phone No.'}
                           onChange={handleChangeEvent}/>
                    <input name={'vehicleNumber'} type='text' value={newCustomer.vehicleNumber}
                           placeholder={'Vehicle No.'} onChange={handleChangeEvent}/>
                    <div className='button' onClick={addNewCustomer}>Add</div>
                </div>
            </div>
        )
    }
    const filterSearchResults = () => {
        setDataSource(dataSource.map((ds: any) =>  ({
             ...ds,
            isVisible: ds[filterField].toLowerCase().includes(filterText.toLowerCase())
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

    const cancelDeleteModal = () => {
        setSelectedRow(null);
        setShowDeleteModal(false);
    }

    const handleDelete = async () => {
        if (!selectedRow) {
            toast.error('No Row is Selected for deletion!');
        }

        const {key, isDeletable, attachedOrders, name, phoneNumber, vehicleNumber} = selectedRow;

        if (isDeletable && !attachedOrders.length) {
            // Call DELETE API
            const res = await POSBackendApiService.deleteCustomer(key);
            if (res.success) {
                const updatedDataSource = dataSource.filter(ds => ds.key !== key);
                setDataSource(updatedDataSource);
                toast.success(`${name || phoneNumber || vehicleNumber} Deleted successfully!`)
            } else {
                toast.error(res.message);
            }
            cancelDeleteModal();
        }
    }

    const onClose = () => {
        if (props.setModalState){
            props.setModalState(MODALS.NONE)
        } else {
            props.changeNavigation();
        }
    }

    return (
        <Overlay closeOverlay={onClose}>
            <div className={'customer-info-container'}>
                <div className="page-heading">
                    <span>View Customer List</span>
                </div>
                <div className='filters'>
                    <div className='filters-text'>Search Customer:</div>
                    <div className='date-range'>
                        <select
                            name={'filterField'}
                            value={filterField}
                            onChange={({target}) => setFilterField(target.value)}
                        >
                            <option>Select an option</option>
                            {
                                ['name', 'phoneNumber', 'vehicleNumber']
                                    .map((dataItem: any) => {
                                        return (
                                            <option value={dataItem}
                                                    selected={dataItem === filterField}>{dataItem.toUpperCase()}</option>
                                        )
                                    })
                            }
                        </select>
                        <input name={'filterText'} type='text' value={filterText} placeholder={'Filter Text'}
                               onChange={(e) => setFilterText(e.target.value)}/>
                        <div className='button search' onClick={filterSearchResults}>Search</div>
                        <div className='button reset' onClick={resetSearchResults}>Reset</div>
                    </div>
                </div>
                <Table
                    dataSource={dataSource.filter(ds => ds.isVisible)}
                    columns={columnsData}
                    pagination={false}
                    footer={getFooterComponent}
                    scroll={{y: 500}}
                />
            </div>
            {
                showDeleteModal && (
                    <AreYouSurePopup
                        title={`Are you sure you want to delete?`}
                        cancelConfirmation={cancelDeleteModal}
                        doneConfirmation={handleDelete}
                    />
                )
            }
        </Overlay>
    )
}

export default ViewAndAddCustomerInfoComponent;

