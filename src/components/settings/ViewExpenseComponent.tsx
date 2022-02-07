import React, {useEffect, useState} from 'react';
import {Table} from "antd";
import Overlay from "../../assets/scss/components/Overlay";
import ExpenseBackendApiService from "../../services/expense-backend-api.service";
import {toast} from "react-toastify";
import AreYouSurePopup from "../base/AreYouSurePopup";
import {ExpensesMenuList} from "../../constants/expense.constants";

// @ts-ignore
const ViewExpenseComponent = ({changeNavigation}) => {
    const [dataSource, setDataSource] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const columns = [
        {
            title: 'S No',
            dataIndex: 'serialNum',
            key: 'serialNum',
        }, {
            title: 'Date',
            dataIndex: 'date',
            key: 'name',
        },
        {
            title: 'Cost',
            dataIndex: 'cost',
            key: 'cost',
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
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
                <>
                    <div className={`action-tag edit-action`} onClick={() => handleEditAction(dataRow)}>
                        Edit
                    </div>
                    <div className={`action-tag delete-action ${!dataRow.isDeletable ? 'disabled' : ''}`}
                         onClick={() => handleDeleteModal(dataRow)}>
                        {dataRow.isDeletable ? 'Delete' : 'Un-Deletable'}
                    </div>
                </>
            ),
        },
    ];

    const handleDeleteModal = (row: any) => {
        if (row.isDeletable) {
            setSelectedRow(row);
            setShowDeleteModal(true);
        }
    }

    const handleDelete = async () => {
        if (!selectedRow) {
            toast.error('No Row is Selected for deletion!');
        }

        const {key, isDeletable, name} = selectedRow;

        if (isDeletable) {
            // Call DELETE API
            const res = await ExpenseBackendApiService.deleteExpense(key);
            if (res.success) {
                const updatedDataSource = dataSource.filter(ds => ds.key !== key);
                setDataSource(updatedDataSource);
                toast.success(`${name} Expense Deleted successfully!`)
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

    const onClose = () => {
        changeNavigation();
    }

    useEffect(() => {
        createDataSource()
    }, []);

    const handleEditAction = (row: any) => {
        console.log('row', row);
        changeNavigation({
            nextSetting: ExpensesMenuList.data.items[5],
            initialData: row,
        })
    }

    const createDataSource = async () => {
        const expenseItems = await ExpenseBackendApiService.fetchALlExpenseItems();
        let localDataSource = expenseItems.map((expense: any, idx: number) => {
            return {
                serialNum: idx + 1,
                key: expense.id,
                id: expense.id,
                date: expense.date,
                cost: expense.cost,
                category: expense.ExpenseCategory?.name,
                description: expense.description,
                isDeletable: expense.isDeletable,
            }
        });

        setDataSource([...localDataSource]);
    }

    return (
        <Overlay closeOverlay={onClose}>
            <div className="page-heading">
                <span>View Expenses</span>
            </div>
            <Table
                dataSource={dataSource}
                columns={columns}
                pagination={false}
                scroll={{x: 1000, y: 500}}
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

export default ViewExpenseComponent;
