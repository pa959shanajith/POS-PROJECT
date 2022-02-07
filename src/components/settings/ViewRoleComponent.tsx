import React, {useEffect, useState} from 'react';
import {Checkbox, Table} from "antd";
import Overlay from "../../assets/scss/components/Overlay";
import RoleBackendApiService from "../../services/role-backend-api.service";
import {FixedType} from "rc-table/lib/interface";
import {toast} from "react-toastify";
import AreYouSurePopup from "../base/AreYouSurePopup";

//@ts-ignore
const ViewRoleComponent = ({changeNavigation}) => {
    const [dataSource, setDataSource] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: 180,
            fixed: 'left' as FixedType,
        },
        {
            title: 'Edit Employee',
            dataIndex: 'editEmployee',
            key: 'editEmployee',
            width: 100,
            render: (value: any) => (
                <Checkbox
                    className={'table-checkbox'}
                    checked={!!value}
                />
            ),
        },
        {
            title: 'View Employee',
            dataIndex: 'viewEmployee',
            key: 'viewEmployee',
            width: 100,
            render: (value: any) => (
                <Checkbox
                    className={'table-checkbox'}
                    checked={!!value}
                />
            ),
        },
        {
            title: 'Edit Material',
            dataIndex: 'editMaterial',
            key: 'editMaterial',
            width: 100,
            render: (value: any) => (
                <Checkbox
                    className={'table-checkbox'}
                    checked={!!value}
                />
            ),
        },
        {
            title: 'View Material',
            dataIndex: 'viewMaterial',
            key: 'viewMaterial',
            width: 100,
            render: (value: any) => (
                <Checkbox
                    className={'table-checkbox'}
                    checked={!!value}
                />
            ),
        },
        {
            title: 'Edit Menu Item',
            dataIndex: 'editMenuItem',
            key: 'editMenuItem',
            width: 100,
            render: (value: any) => (
                <Checkbox
                    className={'table-checkbox'}
                    checked={!!value}
                />
            ),
        },
        {
            title: 'View Menu Item',
            dataIndex: 'viewMenuItem',
            key: 'viewMenuItem',
            width: 100,
            render: (value: any) => (
                <Checkbox
                    className={'table-checkbox'}
                    checked={!!value}
                />
            ),
        },
        {
            title: 'Edit POS Setting',
            dataIndex: 'editPOSSettings',
            key: 'editPOSSettings',
            width: 100,
            render: (value: any) => (
                <Checkbox
                    className={'table-checkbox'}
                    checked={!!value}
                />
            ),
        },
        {
            title: 'View POS Setting',
            dataIndex: 'viewPOSSettings',
            key: 'viewPOSSettings',
            width: 100,
            render: (value: any) => (
                <Checkbox
                    className={'table-checkbox'}
                    checked={!!value}
                />
            ),
        },
        {
            title: 'View Reports',
            dataIndex: 'viewReports',
            key: 'viewReports',
            width: 100,
            render: (value: any) => (
                <Checkbox
                    className={'table-checkbox'}
                    checked={!!value}
                />
            ),
        },
        {
            title: 'Edit Session',
            dataIndex: 'editSession',
            key: 'editSession',
            width: 100,
            render: (value: any) => (
                <Checkbox
                    className={'table-checkbox'}
                    checked={!!value}
                />
            ),
        },{
            title: 'Add Bill',
            dataIndex: 'addBill',
            key: 'addBill',
            width: 100,
            render: (value: any) => (
                <Checkbox
                    className={'table-checkbox'}
                    checked={!!value}
                />
            ),
        },
        {
            title: 'Delete Bill',
            dataIndex: 'deleteBill',
            key: 'deleteBill',
            width: 100,
            render: (value: any) => (
                <Checkbox
                    className={'table-checkbox'}
                    checked={!!value}
                />
            ),
        },
        {
            title: 'Access Setting',
            dataIndex: 'accessSetting',
            key: 'accessSetting',
            width: 100,
            render: (value: any) => (
                <Checkbox
                    className={'table-checkbox'}
                    checked={!!value}
                />
            ),
        },
        {
            title: 'Minimize POS',
            dataIndex: 'minimizePOS',
            key: 'minimizePOS',
            width: 100,
            render: (value: any) => (
                <Checkbox
                    className={'table-checkbox'}
                    checked={!!value}
                />
            ),
        },
        {
            title: 'Edit Inventory',
            dataIndex: 'editInventory',
            key: 'editInventory',
            width: 100,
            render: (value: any) => (
                <Checkbox
                    className={'table-checkbox'}
                    checked={!!value}
                />
            ),
        },
        {
            title: 'View Inventory',
            dataIndex: 'viewInventory',
            key: 'viewInventory',
            width: 100,
            render: (value: any) => (
                <Checkbox
                    className={'table-checkbox'}
                    checked={!!value}
                />
            ),
        },
        {
            title: 'Edit Expense',
            dataIndex: 'editExpense',
            key: 'editExpense',
            width: 100,
            render: (value: any) => (
                <Checkbox
                    className={'table-checkbox'}
                    checked={!!value}
                />
            ),
        },
        {
            title: 'View Expense',
            dataIndex: 'viewExpense',
            key: 'viewExpense',
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
            width: 160,
            fixed: 'right' as FixedType,
            render: (row: any) => (
                <div className={`action-tag delete-action ${!row.isDeletable ? 'disabled' : '' }`} onClick={ () => handleDeleteModal(row)}>
                    {row.isDeletable ? 'Delete' : 'Un-Deletable'}
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
            const res = await RoleBackendApiService.deleteRole({id: key, name: name});
            if (res.success) {
                const updatedDataSource = dataSource.filter(ds => ds.key !== key);
                setDataSource(updatedDataSource);
                toast.success(`${name} Role Deleted successfully!`)
            } else {
                toast.error(res.message);
            }
            cancelDeleteModal();
        }
    }

    useEffect(() =>{
        createDataSource()
    }, []);

    const createDataSource = async () => {
        const rolesDataRes = await RoleBackendApiService.fetchAllRoles();
        if (rolesDataRes.success) {
            let localDataSource = rolesDataRes.data?.map((role: any) => {
                return {
                    key: role.id,
                    name: role.name,
                    editEmployee: role.editEmployee,
                    viewEmployee: role.viewEmployee,
                    editMaterial: role.editMaterial,
                    viewMaterial: role.viewMaterial,
                    editMenuItem: role.editMenuItem,
                    viewMenuItem: role.viewMenuItem,
                    addBill: role.addBill,
                    deleteBill: role.deleteBill,
                    minimizePOS: role.minimizePOS,
                    viewReports: role.viewReports,
                    editPOSSettings: role.editPOSSettings,
                    viewPOSSettings: role.viewPOSSettings,
                    editInventory: role.editInventory,
                    viewInventory: role.viewInventory,
                    editExpense: role.editExpense,
                    viewExpense: role.viewExpense,
                    editSession: role.editSession,
                    accessSettings: role.accessSettings,
                    isDeletable: role.isDeletable,
                }
            });

            setDataSource([...localDataSource]);
        } else {
            toast.error(rolesDataRes.message);
        }

    }

    return (
        <Overlay closeOverlay={onClose}>
            <div className="page-heading">
                <span>View Role</span>
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

export default ViewRoleComponent;

