import {ISetting, ISettingField, SettingColumns} from "./constant";
import AddExpense from "../components/settings/AddExpense";
import AddExpenseCategory from "../components/settings/AddExpenseCategory";
import ViewExpenseCategoryComponent from "../components/settings/ViewExpenseCategoryComponent";
import EditExpenseCategoryComponent from "../components/settings/EditExpenseCategoryComponent";
import ViewExpenseComponent from "../components/settings/ViewExpenseComponent";
import EditExpenseComponent from "../components/settings/EditExpenseComponent";
import MenuList from "../components/settings/MenuList";


export const AddExpenseSetting: ISetting = {
    node: AddExpense,
    type: 'COMPONENT',
    data: {},
}

export const AddExpenseCategorySetting: ISetting = {
    node: AddExpenseCategory,
    type: 'COMPONENT',
    data: {},
}

export const ViewExpenseCategorySetting: ISetting = {
    node: ViewExpenseCategoryComponent,
    type: 'COMPONENT',
    data: {},
}

export const EditExpenseCategorySetting: ISetting = {
    node: EditExpenseCategoryComponent,
    type: 'COMPONENT',
    data: {},
}

export const ViewExpenseSetting: ISetting = {
    node: ViewExpenseComponent,
    type: 'COMPONENT',
    data: {},
}

export const EditExpenseSetting: ISetting = {
    node: EditExpenseComponent,
    type: 'COMPONENT',
    data: {},
}


export const ExpensesMenuList: ISetting = {
    node: MenuList,
    type: 'MENU',
    data: {
        items: [
            {
                key: 'add-new-category',
                name: 'Add New Category',
                subSetting: AddExpenseCategorySetting,
                isSelected: false // DO we really need this for each menuItem, or should just create a wrapper & it will decide WTS
            }, {
                key: 'view-category',
                name: 'View Category',
                subSetting: ViewExpenseCategorySetting,
                isSelected: false // DO we really need this for each menuItem, or should just create a wrapper & it will decide WTS
            }, {
                key: 'edit-category',
                name: 'Edit Category',
                subSetting: EditExpenseCategorySetting,
                isSelected: false // DO we really need this for each menuItem, or should just create a wrapper & it will decide WTS
            }, {
                key: 'add-new-expense',
                name: 'Add New Expense',
                subSetting: AddExpenseSetting,
                isSelected: false // DO we really need this for each menuExpense, or should just create a wrapper & it will decide WTS
            }, {
                key: 'view-expense',
                name: 'View Expense',
                subSetting: ViewExpenseSetting,
                isSelected: false // DO we really need this for each menuItem, or should just create a wrapper & it will decide WTS
            }, {
                key: 'edit-expense',
                name: 'Edit Expense',
                subSetting: EditExpenseSetting,
                isSelected: false // DO we really need this for each menuItem, or should just create a wrapper & it will decide WTS
            }
        ],
        menuListId: SettingColumns.COLUMN2
    }
}


export const AddExpenseFields: ISettingField[] = [
    {
        fieldName: 'date',
        label: 'Date',
        type: 'date',
        value: ''
    }, {
        fieldName: 'expenseCategoryId',
        label: 'Category',
        type: 'dropdown',
        data: [],
        value: ''
    }, {
        fieldName: 'cost',
        label: 'Cost',
        type: 'text',
        value: ''
    }, {
        fieldName: 'description',
        label: 'Description',
        type: 'text',
        value: ''
    },
]

export const EditExpenseFields: ISettingField[] = [
    {
        fieldName: 'date',
        label: 'Date',
        type: 'date',
        value: ''
    }, {
        fieldName: 'expenseCategoryId',
        label: 'Select Expense',
        type: 'dropdown',
        data: [],
        value: ''
    }, {
        fieldName: 'cost',
        label: 'Cost',
        type: 'text',
        value: ''
    }, {
        fieldName: 'description',
        label: 'Description',
        type: 'text',
        value: ''
    },
]

export const AddExpenseCategoryFields = [
    {
        fieldName: 'name',
        label: 'Cat. Name',
        type: 'text',
        value: ''
    }, {
        fieldName: 'description',
        label: 'Description',
        type: 'text',
        value: ''
    },
]
export const EditExpenseCategoryFields: ISettingField[] = [
    {
        fieldName: 'id',
        label: 'Category',
        type: 'dropdown',
        data: [],
        value: ''
    }, {
        fieldName: 'name',
        label: 'Cat. Name',
        type: 'text',
        value: ''
    }, {
        fieldName: 'description',
        label: 'Description',
        type: 'text',
        value: ''
    },
]
