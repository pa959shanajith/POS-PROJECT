import React, {useEffect, useState} from 'react';
import {Table} from "antd";
import Overlay from "../../assets/scss/components/Overlay";
import ExpenseBackendApiService from "../../services/expense-backend-api.service";
import AreYouSurePopup from "../base/AreYouSurePopup";
import {toast} from "react-toastify";

// @ts-ignore
const ViewExpenseCategoryComponent = ({changeNavigation}) => {
    const [dataSource, setDataSource] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const columns = [
        {
            title: 'S No',
            dataIndex: 'serialNum',
            key: 'serialNum',
        },{
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Action',
            key: 'action',
            sorter: true,
            render: (dataRow: any) => (
                <div className={`action-tag delete-action ${!dataRow.isDeletable ? 'disabled' : '' }`} onClick={ () => handleDeleteModal(dataRow)}>
                    {dataRow.isDeletable ? 'Delete' : 'Un-Deletable'}
                </div>
            ),
        },
    ];

    const handleDeleteModal = (row: any) => {
        if (row.isDeletable) {
            setSelectedRow(row);
            setShowDeleteModal(true);
        }
    }

    const onClose = () => {
        changeNavigation();
    }

    const handleDelete = async () => {
        if (!selectedRow) {
            toast.error('No Row is Selected for deletion!');
        }

        const {key, isDeletable, name} = selectedRow;

        if (isDeletable) {
            // Call DELETE API
            const res = await ExpenseBackendApiService.deleteExpenseCategory(key);
            if (res.success) {
                const updatedDataSource = dataSource.filter(ds => ds.key !== key);
                setDataSource(updatedDataSource);
                toast.success(`${name} Expense Category Deleted successfully!`)
            } else {
                toast.error(res.message);
            }
            cancelDeleteModal();
        }
    }

    const cancelDeleteModal = () => {
        setSelectedRow(null);
        setShowDeleteModal(false);
    }

    useEffect(() =>{
        createDataSource()
    }, []);

    const createDataSource = async () => {
        const expenseCats = await ExpenseBackendApiService.fetchALlExpenseCategories();
        let localDataSource = expenseCats.map((expenseCat: any, idx: number) => {
            return {
                serialNum: idx + 1,
                key: expenseCat.id,
                name: expenseCat.name,
                description: expenseCat.description,
                isDeletable: expenseCat.isDeletable,
            }
        });
        setDataSource([...localDataSource]);
    }

    return (
        <Overlay closeOverlay={onClose}>
            <div className="page-heading">
                <span>View Expense Category</span>
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

export default ViewExpenseCategoryComponent;

