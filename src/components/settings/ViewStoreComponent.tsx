import React, {useEffect, useState} from 'react';
import {Table} from "antd";
import Overlay from "../../assets/scss/components/Overlay";
import StoreBackendApiService from "../../services/store-backend-api.service";
import {toast} from "react-toastify";
import AreYouSurePopup from "../base/AreYouSurePopup";
import {StoreMenuList} from "../../constants/store.constants";

// @ts-ignore
const ViewStoreComponent = ({changeNavigation}) => {
    const [dataSource, setDataSource] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const columns = [
        {
            title: 'S.No.',
            dataIndex: 'serialNum',
            key: 'serialNum',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (_: string, row: any) => (
                <div>
                    <span>{row.name}</span>
                    {row.posSetupId && <span className='default-store-tag'>Default Store</span>}
                </div>
            )
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Stocks',
            dataIndex: 'stocks',
            key: 'stocks',
            render: (values: any) => (
                <div className={'reports-bill-items'}>
                    {
                        values.map((item: any) => {
                            return (
                                <>
                                    <div className={'item'}>
                                        <span className={"font-bold"}>{item.materialName} :</span>
                                        <span> {item.currentStock} units</span>
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
            title: 'Action',
            key: 'action',
            sorter: true,
            render: (storeItemRow: any) => (
                <>
                    <div className={`action-tag edit-action`} onClick={ () => handleEditAction(storeItemRow)}>
                        Edit
                    </div>
                    <div className={`action-tag delete-action ${!storeItemRow.isDeletable ? 'disabled' : '' }`} onClick={() => handleEditAction(storeItemRow)}>
                        {storeItemRow.isDeletable ? 'Delete' : 'Un-Deletable'}
                    </div>
                </>
            ),
        },
    ];
    const onClose = () => {
        changeNavigation();
    }

    useEffect(() =>{
        createDataSource()
    }, []);

    const createDataSource = async () => {
        const {data: storeData} = await StoreBackendApiService.fetchAllStore();
        let localDataSource = storeData.map((store: any, idx: number) => {
            return {
                serialNum: idx + 1,
                key: store.id,
                id: store.id,
                name: store.name,
                posSetupId: store.PosSetupId,
                description: store.description,
                stocks: store.Stocks,
                isDeletable: store.isDeletable,
                isActive: store.isActive,
            }
        });

        setDataSource([...localDataSource]);
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

        const {key: storeId, isDeletable} = selectedRow;

        if (isDeletable) {
            const deleteRes = await StoreBackendApiService.deleteStore(storeId);
            if (deleteRes.success) {
                toast.success('Store Deleted SuccessFully!');
                // Filter out the menuItem from List
                const updatedDataSource = dataSource.filter(ds => ds.key !== storeId)
                setDataSource(updatedDataSource);
            } else {
                toast.error(deleteRes.message);
            }
            cancelDeleteModal();
        }
    }

    const handleEditAction = (row: any) => {
        changeNavigation({
            nextSetting: StoreMenuList.data.items[2],
            initialData: row,
        })
    }

    return (
        <Overlay closeOverlay={onClose}>
            <div className="page-heading">
                <span>View Store</span>
            </div>
            <Table
                dataSource={dataSource}
                columns={columns}
                pagination={false}
                scroll={{ y: 500 }}
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

export default ViewStoreComponent;

