import MenuList from "../components/settings/MenuList";
import {ISetting, ISettingField, SettingColumns} from "./constant";
import AdjustStock from "../components/settings/AdjustStock";
import MoveStockComponent from "../components/settings/MoveStockComponent";
import AddUpdateStockComponent from "../components/settings/AddUpdateStockComponent";
import ViewStockComponent from "../components/settings/ViewStockComponent";


export const adjustStockSetting: ISetting = {
    node: AdjustStock,
    type: 'COMPONENT',
    data: {},
}

export const moveStockSetting: ISetting = {
    node: MoveStockComponent,
    type: 'COMPONENT',
    data: {},
}

export const updateStockSetting: ISetting = {
    node: AddUpdateStockComponent,
    type: 'COMPONENT',
    data: {},
}

export const viewStockSetting: ISetting = {
    node: ViewStockComponent,
    type: 'COMPONENT',
    data: {},
}

export const StockMenuItems: ISetting = {
    node: MenuList,
    type: 'MENU',
    data: {
        items: [
            {
                key: 'view-stock',
                name: 'View Stock',
                subSetting: viewStockSetting,
                isSelected: false // DO we really need this for each menuItem, or should just create a wrapper & it will decide WTS
            }, {
                key: 'update-stock',
                name: 'Update Stock',
                subSetting: updateStockSetting,
                isSelected: false // DO we really need this for each menuItem, or should just create a wrapper & it will decide WTS
            }, {
                key: 'adjust-stock',
                name: 'Adjust Stock',
                subSetting: adjustStockSetting,
                isSelected: false // DO we really need this for each menuItem, or should just create a wrapper & it will decide WTS
            },
            {
                key: 'move-stock',
                name: 'Move Stock',
                subSetting: moveStockSetting,
                isSelected: false // DO we really need this for each menuItem, or should just create a wrapper & it will decide WTS
            }
        ],
        menuListId: SettingColumns.COLUMN2
    }
}


export const AdjustStockFields: ISettingField[] = [
    {
        fieldName: 'date',
        label: 'Date',
        type: 'date',
        value: ''
    }, {
        fieldName: 'id',
        label: 'Stock',
        type: 'dropdown',
        data: [],
        value: ''
    }, {
        fieldName: 'currentStock',
        label: 'Current Stock',
        type: 'text',
        disabled: true,
        value: ''
    }, {
        fieldName: 'units',
        label: 'Units',
        type: 'text',
        value: '',
        disabled: true,
    }, {
        fieldName: 'existingStock',
        label: 'Existing Stock',
        type: 'text',
        value: ''
    }, {
        fieldName: 'notes',
        label: 'Notes',
        type: 'text',
        value: ''
    },
]

export const AddUpdateStockFields: ISettingField[] = [
    {
        fieldName: 'date',
        label: 'Date',
        type: 'date',
        value: '',
    }, {
        fieldName: 'materialName', // It should have been material id
        label: 'Material Name',
        type: 'dropdown',
        data: [],
        value: ''
    }, {
        fieldName: 'storeId',
        label: 'Store Name',
        type: 'dropdown',
        data: [],
        value: ''
    }, {
        fieldName: 'currentStock',
        label: 'Current Stock',
        type: 'text',
        value: '',
        disabled: true,
    },{
        fieldName: 'newPurchase',
        label: 'New Purchase',
        type: 'text',
        value: '',
    },
    {
        fieldName: 'price',
        label: 'Total Price',
        type: 'text',
        value: '',
    },
    {
        fieldName: 'units',
        label: 'Units',
        type: 'text',
        value: '',
        disabled: true,
    },
    {
        fieldName: 'priceDiffForEmailAlert',
        label: 'Allowed Price Diff',
        type: 'text',
        value: '',
        disabled: true,
    },
]

export const AdjustStockField: ISettingField[] = [
    {
        fieldName: 'date',
        label: 'Date',
        type: 'date',
        value: '',
    }, {
        fieldName: 'materialName', // It should have been material id
        label: 'Material Name',
        type: 'dropdown',
        data: [],
        value: ''
    }, {
        fieldName: 'storeId', // It should have been material id
        label: 'Store Id',
        type: 'dropdown',
        data: [],
        value: ''
    }, {
        fieldName: 'currentStock',
        label: 'Current Stock',
        type: 'text',
        value: '',
        disabled: true,
    },{
        fieldName: 'existingStock',
        label: 'Existing Stock',
        type: 'text',
        value: '',
    },
]

export const MoveStockFields: ISettingField[] = [
    {
        fieldName: 'date',
        label: 'Date',
        type: 'date',
        value: ''
    }, {
        fieldName: 'moveFromStore',
        label: 'Move From [A]',
        type: 'dropdown',
        data: [],
        value: ''
    }, {
        fieldName: 'selectedStock',
        label: 'Select Stock',
        type: 'dropdown',
        data: [],
        value: ''
    },{
        fieldName: 'units',
        label: 'Units',
        type: 'text',
        value: '',
        disabled: true,
    },
    {
        fieldName: 'currentStockA',
        label: 'Current Stock [A]',
        type: 'text',
        disabled: true,
        value: ''
    },{
        fieldName: 'moveToStore',
        label: 'Move To [B]',
        type: 'dropdown',
        data: [],
        value: ''
    },
    {
        fieldName: 'currentStockB',
        label: 'Current Stock [B]',
        type: 'text',
        disabled: true,
        value: ''
    },  {
        fieldName: 'stockMoveCount',
        label: 'Transfer Count',
        type: 'text',
        value: ''
    },
]
