import MenuList from "../components/settings/MenuList";
import {ISetting, ISettingField, SettingColumns} from "./constant";
import AddNewStore from "../components/settings/AddNewStore";
import ViewStoreComponent from "../components/settings/ViewStoreComponent";
import EditStoreComponent from "../components/settings/EditStoreComponent";

export const AddStoreSetting: ISetting = {
    node: AddNewStore,
    type: 'COMPONENT',
    data: {},
}

export const ViewStoreSetting: ISetting = {
    node: ViewStoreComponent,
    type: 'COMPONENT',
    data: {},
}

export const EditStoreSetting: ISetting = {
    node: EditStoreComponent,
    type: 'COMPONENT',
    data: {},
}

export const StoreMenuList: ISetting = {
    node: MenuList,
    type: 'MENU',
    data: {
        items: [
            {
                key: 'add-new-store',
                name: 'Add New',
                subSetting: AddStoreSetting,
                isSelected: false // DO we really need this for each menuItem, or should just create a wrapper & it will decide WTS
            }, {
                key: 'view-store',
                name: 'View Store',
                subSetting: ViewStoreSetting,
                isSelected: false // DO we really need this for each menuItem, or should just create a wrapper & it will decide WTS
            }, {
                key: 'edit-store',
                name: 'Edit Store',
                subSetting: EditStoreSetting,
                isSelected: false // DO we really need this for each menuItem, or should just create a wrapper & it will decide WTS
            },
        ],
        menuListId: SettingColumns.COLUMN2,
    }
}

export const AddNewStoreFields = [
    {
        fieldName: 'name',
        label: 'Store Name',
        type: 'text',
        value: ''
    }, {
        fieldName: 'description',
        label: 'Description',
        type: 'text',
        value: ''
    }
]

export const EditStoreFields: ISettingField[] = [
    {
        fieldName: 'id',
        label: 'Store',
        type: 'dropdown',
        data: [],
        value: ''
    },
    {
        fieldName: 'name',
        label: 'Store Name',
        type: 'text',
        value: '',
    }, {
        fieldName: 'description',
        label: 'Description',
        type: 'text',
        value: ''
    }
]


