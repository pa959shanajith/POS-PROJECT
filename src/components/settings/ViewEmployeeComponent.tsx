import React, {useEffect, useState} from 'react';
import {Checkbox, Table} from "antd";
import Overlay from "../../assets/scss/components/Overlay";
import EmployeeBackendApiService from "../../services/employee-backend-api.service";
import db from "../../db";
import {TABLES} from "../../db/db.constants";
import {toast} from "react-toastify";
import AreYouSurePopup from "../base/AreYouSurePopup";

const ViewEmployeeComponent = (props: {changeNavigation: Function}) => {
    const [dataSource, setDataSource] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const {changeNavigation} = props;

    const columns = [
        {
            title: 'UserName',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: 'Is Active?',
            dataIndex: 'isActive',
            key: 'isActive',
            width: 100,
            render: (value: any) => (
                <Checkbox
                    className={'table-checkbox'}
                    checked={!!value}
                />
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (dataRow: any) => (
                <div className={`action-tag delete-action ${!dataRow.isDeletable ? 'disabled' : '' }`} onClick={ () => handleDeleteModal(dataRow)}>
                    {dataRow.isDeletable ? 'Delete' : 'Un-Deletable'}
                </div>
            ),
        },
    ];
    const onClose = () => {
        changeNavigation();
    }

    const handleDeleteModal = (row: any) => {
        if (row.isDeletable) {
            setSelectedRow(row);
            setShowDeleteModal(true);
        }
    }

    const cancelDeleteModal = () => {
        setSelectedRow(null);
        setShowDeleteModal(false);
    }

    const handleDelete = async () => {
        if (!selectedRow) {
            toast.error('No Row is Selected for deletion!');
        }

        const {key, isDeletable, name} = selectedRow;

        if (isDeletable) {
            // Call DELETE API
            const res = await EmployeeBackendApiService.deleteEmployee(key);
            if (res.success) {
                const updatedDataSource = dataSource.filter(ds => ds.key !== key);
                setDataSource(updatedDataSource);
                toast.success(`${name} Deleted successfully!`)
            } else {
                toast.error(res.message);
            }
            cancelDeleteModal();
        }
    }

    useEffect(() =>{
        createDataSource()
    }, []);

    const fetchEmployeeData = async () => {
        const cachedEmployees = await db.table(TABLES.EMPLOYEES).toArray();
        if (cachedEmployees.length) {
            return cachedEmployees;
        }
        const {data} = await EmployeeBackendApiService.fetchAllEmployees();
        return data;
    }

    const createDataSource = async () => {
        const employeeData = await fetchEmployeeData();
        let localDataSource = employeeData.map((employee: any) => {
            return {
                key: employee.id,
                username: employee.name,
                name: employee.name,
                role: employee.Role?.name,
                isDeletable: employee.isDeletable,
                isActive: employee.isActive,
            }
        });
        setDataSource([...localDataSource]);
    }

    return (
       <Overlay closeOverlay={onClose}>
           <div className="page-heading">
               <span>View Employee</span>
           </div>
           <Table
               dataSource={dataSource}
               columns={columns}
               pagination={false}
               scroll={{ x: 1500, y: 500 }}
           />
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

export default ViewEmployeeComponent;

