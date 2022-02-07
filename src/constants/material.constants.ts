import ViewMaterialComponent from "../components/settings/ViewMaterialComponent";
import EditMaterialComponent from "../components/settings/EditMaterialComponent";
import AddMaterial from "../components/settings/AddMaterial";
import {ISetting, ISettingField, SettingColumns} from "./constant";
import MenuList from "../components/settings/MenuList";
import ViewUnitComponent from "../components/settings/ViewUnitComponent";
import EditUnitComponent from "../components/settings/EditUnitComponent";
import AddUnitComponent from "../components/settings/AddUnitComponent";

export const ViewUnitSetting: ISetting = {
    node: ViewUnitComponent,
    type: 'COMPONENT',
    data: {},
}

export const EditUnitSetting: ISetting = {
    node: EditUnitComponent,
    type: 'COMPONENT',
    data: {},
}

export const AddUnitSetting: ISetting = {
    node: AddUnitComponent,
    type: 'COMPONENT',
    data: {},
}


export const ViewMaterialSetting: ISetting = {
    node: ViewMaterialComponent,
    type: 'COMPONENT',
    data: {},
}

export const EditMaterialSetting: ISetting = {
    node: EditMaterialComponent,
    type: 'COMPONENT',
    data: {},
}

export const AddMaterialSetting: ISetting = {
    node: AddMaterial,
    type: 'COMPONENT',
    data: {},
}

export const MaterialMenuList: ISetting = {
    node: MenuList,
    type: 'MENU',
    data: {
        items: [
            {
                key: 'add-unit',
                name: 'Add Unit',
                subSetting: AddUnitSetting,
                isSelected: false // DO we really need this for each menuItem, or should just create a wrapper & it will decide WTS
            }, {
                key: 'view-unit',
                name: 'View Unit',
                subSetting: ViewUnitSetting,
                isSelected: false // DO we really need this for each menuItem, or should just create a wrapper & it will decide WTS
            }, {
                key: 'edit-unit',
                name: 'Edit Unit',
                subSetting: EditUnitSetting,
                isSelected: false // DO we really need this for each menuItem, or should just create a wrapper & it will decide WTS
            },{
                key: 'add-material',
                name: 'Add Material',
                subSetting: AddMaterialSetting,
                isSelected: false // DO we really need this for each menuItem, or should just create a wrapper & it will decide WTS
            }, {
                key: 'view-material',
                name: 'View Material',
                subSetting: ViewMaterialSetting,
                isSelected: false // DO we really need this for each menuItem, or should just create a wrapper & it will decide WTS
            }, {
                key: 'edit-material',
                name: 'Edit Material',
                subSetting: EditMaterialSetting,
                isSelected: false // DO we really need this for each menuItem, or should just create a wrapper & it will decide WTS
            }],
        menuListId: SettingColumns.COLUMN2
    }
}


export const AddMaterialFields: ISettingField[] = [
    {
        fieldName: 'name',
        label: 'Material Name',
        type: 'text',
        value: ''
    }, {
        fieldName: 'units',
        label: 'Units',
        type: 'dropdown',
        data: [],
        value: ''
    },  {
        fieldName: 'description',
        label: 'Description',
        type: 'text',
        value: ''
    },  {
        fieldName: 'priceDiffForEmailAlert',
        label: 'Price Diff (Email Alert)',
        type: 'text',
        value: ''
    }
]

export const EditMaterialFields: ISettingField[] = [
    {
        fieldName: 'id',
        label: 'Material',
        type: 'dropdown',
        data: [],
        value: ''
    },{
        fieldName: 'name',
        label: 'Material Name',
        type: 'text',
        value: ''
    }, {
        fieldName: 'units',
        label: 'Units',
        type: 'text',
        value: ''
    }, {
        fieldName: 'description',
        label: 'Description',
        type: 'text',
        value: ''
    },  {
        fieldName: 'priceDiffForEmailAlert',
        label: 'Price Diff (Email Alert)',
        type: 'text',
        value: ''
    }
]


export const AddUnitFields: ISettingField[] = [
    {
        fieldName: 'name',
        label: 'Unit Name',
        type: 'text',
        value: ''
    }, {
        fieldName: 'shortForm',
        label: 'Short Form',
        type: 'text',
        value: ''
    },  {
        fieldName: 'description',
        label: 'Description',
        type: 'text',
        value: ''
    }
]

export const EditUnitFields: ISettingField[] = [
    {
        fieldName: 'id',
        label: 'Unit',
        type: 'dropdown',
        data: [],
        value: ''
    },{
        fieldName: 'name',
        label: 'New Name',
        type: 'text',
        value: ''
    }, {
        fieldName: 'shortForm',
        label: 'Short Form',
        type: 'text',
        value: ''
    }, {
        fieldName: 'description',
        label: 'Description',
        type: 'text',
        value: ''
    }
]
