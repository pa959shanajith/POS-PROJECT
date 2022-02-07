import React, {useEffect, useState} from 'react';
import {Checkbox, Table} from "antd";
import Overlay from "../../assets/scss/components/Overlay";
import MenuItemsBackendApiService from "../../services/menu-items-backend-api.service";
import {FixedType} from "rc-table/lib/interface";
import POSBackendApiService from "../../services/pos-backend-api.service";
import {toast} from "react-toastify";
import AreYouSurePopup from "../base/AreYouSurePopup";

// @ts-ignore
const ViewMenuItemComponent = ({changeNavigation}) => {
    const [dataSource, setDataSource] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: 160,
            fixed: 'left' as FixedType,
        },
        {
            title: 'Arabic Name',
            dataIndex: 'arabicName',
            key: 'arabicName',
            width: 160,
            fixed: 'left' as FixedType,
        },
        {
            title: 'Is Variant?',
            dataIndex: 'isVariant',
            key: 'isVariant',
            width: 160,
            render: (value: any) => (
                <Checkbox
                    className={'table-checkbox'}
                    checked={!!value}
                />
            ),
            fixed: 'left' as FixedType,
        },
        {
            title: 'Original Menu',
            dataIndex: 'originalMenuName',
            key: 'originalMenuName',
            width: 160,
            fixed: 'left' as FixedType,
        },
        {
            title: 'Category',
            dataIndex: 'categoryName',
            key: 'categoryName',
        },
        {
            title: 'Materials',
            key: 'materials',
            width: 300,
            dataIndex: 'materials',
            render: (materials: any) => {
                return materials.map((material: any) => {
                    console.log(material)
                    return (
                        <div className={'action-tag edit-action '}>
                            {material?.materialName?.substr(0, 10)} : <b>{material?.quantity}</b>
                        </div>
                    )
                })
            },
        },
        {
            title: 'Selling Price',
            dataIndex: 'sellingPrice',
            key: 'sellingPrice',
        },
        {
            title: 'Is Favorite?',
            dataIndex: 'isFavorite',
            key: 'isFavorite',
            render: (value: any) => (
                <Checkbox
                    className={'table-checkbox'}
                    checked={!!value}
                />
            ),
        },
        {
            title: 'Printer 1',
            dataIndex: 'printer1',
            key: 'printer1',
            render: (value: any) => (
                <Checkbox
                    className={'table-checkbox'}
                    checked={!!value}
                />
            ),
        },
        {
            title: 'Printer 2',
            dataIndex: 'printer2',
            key: 'printer2',
            render: (value: any) => (
                <Checkbox
                    className={'table-checkbox'}
                    checked={!!value}
                />
            ),
        },
        {
            title: 'Printer 3',
            dataIndex: 'printer3',
            key: 'printer3',
            render: (value: any) => (
                <Checkbox
                    className={'table-checkbox'}
                    checked={!!value}
                />
            ),
        },
        {
            title: 'BarCode',
            dataIndex: 'barCode',
            key: 'barCode',
        },
        {
            title: 'Action',
            key: 'action',
            width: 160,
            fixed: 'right' as FixedType,
            render: (menuItemRow: any) => (
                <div className={`action-tag delete-action ${!menuItemRow.isDeletable ? 'disabled' : '' }`} onClick={ () => handleDeleteModal(menuItemRow)}>
                    {menuItemRow.isDeletable ? 'Delete' : 'Un-Deletable'}
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

        const {key: menuItemId, isDeletable} = selectedRow;

        if (isDeletable) {
            const deleteRes = await MenuItemsBackendApiService.deleteMenuItem(menuItemId);
            if (deleteRes.success) {
                toast.success('Menu Item Deleted SuccessFully!');
                // Filter out the menuItem from List
                const updatedDataSource = dataSource.filter(ds => ds.key !== menuItemId)
                setDataSource(updatedDataSource);
            } else {
                toast.error(deleteRes.message);
            }
            cancelDeleteModal();
        }
    }

    useEffect(() =>{
        createDataSource()
    }, []);

    const createDataSource = async () => {
        const {success, data: menuItemsData, message} = await MenuItemsBackendApiService.fetchAllMenuItems();
        if (success) {
            let localDataSource: any = [];
            menuItemsData.map((menuItem: any) => {
                localDataSource.push({
                    key: menuItem.id,
                    name: menuItem.name,
                    isVariant: false,
                    originalMenuName: '--',
                    arabicName: menuItem.arabicName,
                    categoryName: menuItem.MenuItemCategory.name,
                    materials: menuItem.materials,
                    sellingPrice: menuItem.sellingPrice,
                    isFavorite: menuItem.isFavorite,
                    printer1: menuItem.printer1,
                    printer2: menuItem.printer2,
                    printer3: menuItem.printer3,
                    barCode: menuItem.barCode,
                    isDeletable: menuItem.isDeletable,
                    isActive: menuItem.isActive,
                });
                menuItem.variants.map((v: any) => {
                    localDataSource.push({
                        key: v.id,
                        isVariant: true,
                        originalMenuName: menuItem.name,
                        name: v.name,
                        arabicName: v.arabicName,
                        categoryName: menuItem.MenuItemCategory.name,
                        materials: v.materials,
                        sellingPrice: v.sellingPrice,
                        isFavorite: menuItem.isFavorite,
                        printer1: menuItem.printer1,
                        printer2: menuItem.printer2,
                        printer3: menuItem.printer3,
                        barCode: menuItem.barCode,
                        isDeletable: false,
                        isActive: false,
                    });
                })
            });

            setDataSource([...localDataSource]);
        } else {
            toast.error(message);
        }
    }

    return (
        <Overlay closeOverlay={onClose}>
            <div className="page-heading">
                <span>View Menu Items</span>
            </div>
            <Table
                dataSource={dataSource}
                columns={columns}
                pagination={false}
                scroll={{ x: 1900, y: 500 }}
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

export default ViewMenuItemComponent;

