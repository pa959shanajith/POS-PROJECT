import MenuList from "../components/settings/MenuList";
import {ISetting, ISettingField, SettingColumns} from "./constant";
import ViewEmployeeComponent from "../components/settings/ViewEmployeeComponent";
import EditEmployeeComponent from "../components/settings/EditEmployeeComponent";
import AddEmployee from "../components/settings/AddEmployee";
import {AddRoleSetting, EditRoleSetting, ViewRoleSetting} from "./role.constants";

export const ViewEmployeeSetting: ISetting = {
    node: ViewEmployeeComponent,
    type: 'COMPONENT',
    data: {}
}

export const EditEmployeeSetting: ISetting = {
    node: EditEmployeeComponent,
    type: 'COMPONENT',
    data: {}
}

export const AddEmployeeSetting: ISetting = {
    node: AddEmployee,
    type: 'COMPONENT',
    data: {
        nextSetting: ViewEmployeeSetting
    },
}

export const EmployeesMenuSetting: ISetting = {
    node: MenuList,
    type: 'MENU',
    data: {
        items: [
            {
                key: 'add-roles',
                name: 'Add Role',
                subSetting: AddRoleSetting,
                isSelected: false // DO we really need this for each menuItem, or should just create a wrapper & it will decide WTS
            }, {
                key: 'view-roles',
                name: 'View Role',
                subSetting: ViewRoleSetting,
                isSelected: false // DO we really need this for each menuItem, or should just create a wrapper & it will decide WTS
            }, {
                key: 'edit-roles',
                name: 'Edit Role',
                subSetting: EditRoleSetting,
                isSelected: false // DO we really need this for each menuItem, or should just create a wrapper & it will decide WTS
            }, {
                key: 'add-employee',
                name: 'Add Employee',
                subSetting: AddEmployeeSetting,
                isSelected: false // DO we really need this for each menuItem, or should just create a wrapper & it will decide WTS
            }, {
                key: 'view-employees',
                name: 'View Employee',
                subSetting: ViewEmployeeSetting,
                isSelected: false // DO we really need this for each menuItem, or should just create a wrapper & it will decide WTS
            },{
                key: 'edit-employees',
                name: 'Edit Employee',
                subSetting: EditEmployeeSetting,
                isSelected: false // DO we really need this for each menuItem, or should just create a wrapper & it will decide WTS
            }
        ],
        menuListId: SettingColumns.COLUMN2
    }
}


export const AddEmployeeFields: ISettingField[] = [
    {
        fieldName: 'name',
        label: 'Name',
        type: 'text',
        value: ''
    },  {
        fieldName: 'pin',
        label: 'PIN',
        type: 'text',
        value: ''
    },{
        fieldName: 'roleId',
        label: 'Role',
        type: 'dropdown',
        data: [],
        value: ''
    },
];

export const EditEmployeeFields: ISettingField[] = [
    {
        fieldName: 'id',
        label: 'Employee',
        type: 'dropdown',
        data: [],
        value: ''
    }, {
        fieldName: 'name',
        label: 'Name',
        type: 'text',
        value: ''
    },  {
        fieldName: 'pin',
        label: 'PIN',
        type: 'text',
        value: ''
    },{
        fieldName: 'roleId',
        label: 'Role',
        type: 'dropdown',
        data: [],
        value: ''
    },
    {
        fieldName: 'isActive',
        label: 'Is Active',
        type: 'dropdown',
        data: [ {
            value: true,
            label: 'YES',
        },{
            value: false,
            label: 'NO',
        } ],
        value: ''
    },
];
