import React, {useEffect, useState} from 'react';
import {Checkbox, Table} from "antd";
import Overlay from "../../assets/scss/components/Overlay";
import MenuItemsBackendApiService from "../../services/menu-items-backend-api.service";
import {toast} from "react-toastify";

// @ts-ignore
const ViewMenuCategoryComponent = ({changeNavigation}) => {
    const [dataSource, setDataSource] = useState([]);

    const columns = [
        {
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
            title: 'Is Favourite',
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
            title: 'Action',
            key: 'action',
            sorter: true,
            render: () => (
                <div className={'action-tag delete-action '}>
                    Delete
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
        const {success, data: menuCats, message} = await MenuItemsBackendApiService.fetchAllMenuCategories();
        if (success) {
            let localDataSource = menuCats?.map((menuCat: any) => {
                return {
                    key: menuCat.id,
                    name: menuCat.name,
                    description: menuCat.description,
                    isFavorite: menuCat.isFavorite,
                }
            });

            setDataSource([...localDataSource]);
        } else {
            toast.error(message);
        }
    }

    return (
        <Overlay closeOverlay={onClose}>
            <div className="page-heading">
                <span>View Menu Category</span>
            </div>
            <Table
                dataSource={dataSource}
                columns={columns}
                pagination={false}
                scroll={{ x: 1500, y: 500 }}
            />
        </Overlay>
    )

}

export default ViewMenuCategoryComponent;

