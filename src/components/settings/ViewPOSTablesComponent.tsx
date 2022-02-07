import React, {useEffect, useState} from 'react';
import {Table} from "antd";
import Overlay from "../../assets/scss/components/Overlay";
import MenuItemsBackendApiService from "../../services/menu-items-backend-api.service";
import {FixedType} from "rc-table/lib/interface";
import POSBackendApiService from "../../services/pos-backend-api.service";
import {toast} from "react-toastify";
import AreYouSurePopup from "../base/AreYouSurePopup";

// @ts-ignore
const ViewPOSTablesComponent = ({changeNavigation}) => {
    const [dataSource, setDataSource] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const columns = [
        {
            title: 'S No',
            dataIndex: 'serialNo',
            key: 'serialNo',
            width: 80,
            fixed: 'left' as FixedType,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            fixed: 'left' as FixedType,
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'No. Of Person',
            dataIndex: 'noOfPerson',
            key: 'noOfPerson',
        },
        {
            title: 'Action',
            key: 'action',
            width: 160,
            fixed: 'right' as FixedType,
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

        const {key: tableId, isDeletable} = selectedRow;

        if (isDeletable) {
            const deleteRes = await POSBackendApiService.deleteTable(tableId);
            if (deleteRes.success) {
                toast.success('Table Deleted Successfully!');
                // Filter out the menuItem from List
                const updatedDataSource = dataSource.filter(ds => ds.key !== tableId)
                setDataSource(updatedDataSource);
            } else {
                toast.error(deleteRes.message);
            }
            cancelDeleteModal();
        }
    }

    useEffect(() => {
        createDataSource()
    }, []);

    const createDataSource = async () => {
        const {success, data: tablesData, message} = await POSBackendApiService.fetchAllTables();
        if (success) {
            let localDataSource = tablesData.map((tableItem: any, idx: number) => {
                return {
                    serialNo: idx + 1,
                    key: tableItem.id,
                    name: tableItem.name,
                    description: tableItem.description,
                    noOfPerson: tableItem.noOfPerson,
                    isDeletable: tableItem.isDeletable,
                }
            });

            setDataSource([...localDataSource]);
        } else {
            toast.error(message);
        }
    }
    console.log(dataSource)
    return (
        <Overlay closeOverlay={onClose}>
            <div className="page-heading">
                <span>View Tables</span>
            </div>
            <Table
                dataSource={dataSource}
                columns={columns}
                pagination={false}
                scroll={{ x: 1000, y: 500 }}
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

export default ViewPOSTablesComponent;

