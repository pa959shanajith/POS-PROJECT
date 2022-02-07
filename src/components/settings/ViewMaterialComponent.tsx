import React, {useEffect, useState} from 'react';
import {Table} from "antd";
import Overlay from "../../assets/scss/components/Overlay";
import MaterialBackendApiService from "../../services/material-backend-api.service";
import MenuItemsBackendApiService from "../../services/menu-items-backend-api.service";
import {toast} from "react-toastify";
import AreYouSurePopup from "../base/AreYouSurePopup";

// @ts-ignore
const ViewMaterialComponent = ({changeNavigation}) => {
    const [dataSource, setDataSource] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Units',
            dataIndex: 'units',
            key: 'units',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
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
            render: (materialRow: any) => (
                <div className={`action-tag delete-action ${!materialRow.isDeletable ? 'disabled' : '' }`} onClick={ () => handleDeleteModal(materialRow)}>
                    {materialRow.isDeletable ? 'Delete' : 'Un-Deletable'}
                </div>
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
        const {data: materialsResData} = await MaterialBackendApiService.fetchAllMaterials();
        let localDataSource = materialsResData.map((material: any) => {
            return {
                key: material.id,
                name: material.name,
                price: material.price,
                units: material.units,
                description: material.description,
                isDeletable: material.isDeletable,
                isActive: material.isActive,
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

        const {key: materialId, isDeletable} = selectedRow;

        if (isDeletable) {
            const deleteRes = await MaterialBackendApiService.deleteMaterial(materialId);
            if (deleteRes.success) {
                toast.success('Material Deleted SuccessFully!');
                // Filter out the menuItem from List
                const updatedDataSource = dataSource.filter(ds => ds.key !== materialId)
                setDataSource(updatedDataSource);
            } else {
                toast.error(deleteRes.message);
            }
            cancelDeleteModal();
        }
    }

    return (
        <Overlay closeOverlay={onClose}>
            <div className="page-heading">
                <span>View Material</span>
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

export default ViewMaterialComponent;

