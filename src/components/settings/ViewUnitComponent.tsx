import React, {useEffect, useState} from 'react';
import {Table} from "antd";
import Overlay from "../../assets/scss/components/Overlay";
import UnitBackendApiService from "../../services/unit-backend-api.service";
import {toast} from "react-toastify";
import AreYouSurePopup from "../base/AreYouSurePopup";

// @ts-ignore
const ViewUnitComponent = ({changeNavigation}) => {
    const [dataSource, setDataSource] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const columns = [
        {
            title: 'S.No',
            dataIndex: 'serialNum',
            key: 'serialNum',
        },{
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Short Form',
            dataIndex: 'shortForm',
            key: 'shortForm',
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
            render: (unitRow: any) => (
                <div className={`action-tag delete-action ${!unitRow.isDeletable ? 'disabled' : '' }`} onClick={ () => handleDeleteModal(unitRow)}>
                    {unitRow.isDeletable ? 'Delete' : 'Un-Deletable'}
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
        const {data: unitsResData} = await UnitBackendApiService.fetchAllUnits();
        let localDataSource = unitsResData.map((unit: any) => {
            return {
                key: unit.id,
                name: unit.name,
                shortForm: unit.shortForm,
                description: unit.description,
                isDeletable: unit.isDeletable,
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

        const {key: unitId, isDeletable} = selectedRow;

        if (isDeletable) {
            const deleteRes = await UnitBackendApiService.deleteUnit(unitId);
            if (deleteRes.success) {
                toast.success('Unit Deleted SuccessFully!');
                // Filter out the menuItem from List
                const updatedDataSource = dataSource.filter(ds => ds.key !== unitId)
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
                <span>View Units</span>
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

export default ViewUnitComponent;

