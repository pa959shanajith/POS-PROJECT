import React, {useEffect, useState} from 'react';
import {Table} from "antd";
import Overlay from "../../assets/scss/components/Overlay";
import StockBackendApiService from "../../services/stock-backend-api.service";
import {FixedType} from "rc-table/lib/interface";

// @ts-ignore
const ViewStockComponent = ({changeNavigation}) => {
    const [dataSource, setDataSource] = useState([]);

    const columns = [
        {
            title: 'Name',
            dataIndex: 'materialName',
            key: 'materialName',
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
            title: 'Current Stock',
            dataIndex: 'currentStock',
            key: 'currentStock',
        },
        {
            title: 'Store name',
            dataIndex: 'storeName',
            key: 'storeName',
        },
    ];
    const onClose = () => {
        changeNavigation();
    }

    useEffect(() =>{
        createDataSource()
    }, []);

    const createDataSource = async () => {
        const {data: stockRes} = await StockBackendApiService.fetchAllStocks();
        let localDataSource = stockRes.map((stock: any) => {
            return {
                key: stock.id,
                materialName: stock.materialName,
                currentStock: stock.currentStock,
                units: stock.units,
                price: stock.price,
                storeName: stock.Store.name,
            }
        });
        setDataSource([...localDataSource]);
    }

    return (
        <Overlay closeOverlay={onClose}>
            <div className="page-heading">
                <span>View Stock</span>
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

export default ViewStockComponent;

