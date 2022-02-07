import {SettingColumns, ISetting, ISettingField} from "./constant";
import AddMenuItemComponent from "../components/settings/AddMenuItemComponent";
import ViewMenuItemComponent from "../components/settings/ViewMenuItemComponent";
import EditMenuItemComponent from "../components/settings/EditMenuItemComponent";
import MenuList from "../components/settings/MenuList";
import AddNewMenuCategory from "../components/settings/AddNewMenuCategory";
import ViewMenuCategoryComponent from "../components/settings/ViewMenuCategoryComponent";
import EditMenuCategoryComponent from "../components/settings/EditMenuCategoryComponent";
import AddMenuItemVariantComponent from "../components/settings/AddMenuItemVariantComponent";
import EditMenuItemVariantComponent from "../components/settings/EditMenuItemVariantComponent";

// Menu items category section
export const AddNewMenuCategorySetting: ISetting = {
    node: AddNewMenuCategory,
    type: 'COMPONENT',
    data: {},
}

export const ViewMenuCategorySetting: ISetting = {
    node: ViewMenuCategoryComponent,
    type: 'COMPONENT',
    data: {},
}

export const EditMenuCategorySetting: ISetting = {
    node: EditMenuCategoryComponent,
    type: 'COMPONENT',
    data: {},
}
// Menu items sections
export const AddNewMenuItemSetting: ISetting = {
    node: AddMenuItemComponent,
    type: 'COMPONENT',
    data: {},
}

export const ViewMenuItemSetting: ISetting = {
    node: ViewMenuItemComponent,
    type: 'COMPONENT',
    data: {},
}

export const EditMenuItemSetting: ISetting = {
    node: EditMenuItemComponent,
    type: 'COMPONENT',
    data: {},
}

// Menu Item Variants Section
export const AddNewMenuItemVariantSetting: ISetting = {
    node: AddMenuItemVariantComponent,
    type: 'COMPONENT',
    data: {},
}

export const EditMenuItemVariantSetting: ISetting = {
    node: EditMenuItemVariantComponent,
    type: 'COMPONENT',
    data: {},
}

export const AddNewMenuCategoryFields: ISettingField[] = [
    {
        fieldName: 'name',
        label: 'Category Name',
        type: 'text',
        value: ''
    }, {
        fieldName: 'description',
        label: 'Description',
        type: 'text',
        value: ''
    },  {
        fieldName: 'isFavorite',
        label: 'Is Favourite?',
        type: 'checkbox',
        value: false
    }
]

export const EditMenuCategoryFields: ISettingField[] = [
    {
        fieldName: 'id',
        label: 'Category',
        type: 'dropdown',
        data: [],
        value: ''
    },
    {
        fieldName: 'name',
        label: 'Category Name',
        type: 'text',
        value: ''
    }, {
        fieldName: 'description',
        label: 'Description',
        type: 'text',
        value: ''
    },  {
        fieldName: 'isFavorite',
        label: 'Is Favourite?',
        type: 'checkbox',
        value: false
    }
]

export const AddNewMenuItemFields: any = [
    {
        fieldName: 'name',
        label: 'Menu Item Name',
        type: 'text',
        value: ''
    }, {
        fieldName: 'arabicName',
        label: 'Arabic Name',
        type: 'text',
        value: ''
    },{
        fieldName: 'menuItemCategoryId',
        label: 'Menu category',
        type: 'dropdown',
        data: [],
        value: ''
    },
    {
        fieldName: 'material',
        label: 'Material',
        type: 'group',
        value: [],
        fields: [{
            fieldName: 'material1',
            label: 'Material 1',
            type: 'group',
            value: {materialName: '', quantity: ''},
        }],
    },
    {
        fieldName: 'sellingPrice',
        label: 'Selling Price',
        type: 'text',
        value: '',
    },
    {
        fieldName: 'isFavorite',
        label: 'Is Favorite',
        type: 'checkbox',
        value: false,
    },
    {
        fieldName: 'printer1',
        label: 'Printer 1',
        type: 'checkbox',
        value: false,
    }, {
        fieldName: 'printer2',
        label: 'Printer 2',
        type: 'checkbox',
        value: false,
    }, {
        fieldName: 'printer3',
        label: 'Printer 3',
        type: 'checkbox',
        value: false,
    },
    {
        fieldName: 'barCode',
        label: 'Barcode',
        type: 'text',
        value: '',
    },
]

export const AddNewMenuItemVariantFields: any = [
    {
        fieldName: 'menuItemId',
        label: 'Menu Item',
        type: 'dropdown',
        data: [],
        value: '',
    }, {
        fieldName: 'name',
        label: 'Variant Name',
        type: 'text',
        value: ''
    }, {
        fieldName: 'arabicName',
        label: 'Arabic Name',
        type: 'text',
        value: ''
    }, {
        fieldName: 'material',
        label: 'Material',
        type: 'group',
        value: [],
        fields: [{
            fieldName: 'material1',
            label: 'Material 1',
            type: 'group',
            value: {materialName: '', quantity: ''},
        }],
    }, {
        fieldName: 'sellingPrice',
        label: 'Selling Price',
        type: 'text',
        value: '',
    },
]

export const EditMenuItemFields: any = [
    {
        fieldName: 'id',
        label: 'Variant',
        type: 'dropdown',
        data: [],
        value: '',
    }, {
        fieldName: 'name',
        label: 'Variant Name',
        type: 'text',
        value: ''
    },
    {
        fieldName: 'arabicName',
        label: 'Arabic Name',
        type: 'text',
        value: ''
    },
    {
        fieldName: 'material',
        label: 'Material',
        type: 'group',
        value: [],
        fields: [{
            fieldName: 'material1',
            label: 'Material 1',
            type: 'group',
            value: {materialName: '', quantity: ''},
            // its not being used, instead we are using materials for values
        }],
    },
    {
        fieldName: 'sellingPrice',
        label: 'Selling Price',
        type: 'text',
        value: '',
    }
];


export const MenuItemsMenuList: ISetting = {
    node: MenuList,
    type: 'MENU',
    data: {
        items: [
            {
                key: 'add-new-category',
                name: 'Add New Category',
                subSetting: AddNewMenuCategorySetting,
                isSelected: false // DO we really need this for each menuItem, or should just create a wrapper & it will decide WTS
            }, {
                key: 'view-category',
                name: 'View Category',
                subSetting: ViewMenuCategorySetting,
                isSelected: false // DO we really need this for each menuItem, or should just create a wrapper & it will decide WTS
            }, {
                key: 'edit-category',
                name: 'Edit Category',
                subSetting: EditMenuCategorySetting,
                isSelected: false // DO we really need this for each menuItem, or should just create a wrapper & it will decide WTS
            }, {
                key: 'add-new-item',
                name: 'Add New Item',
                subSetting: AddNewMenuItemSetting,
                isSelected: false // DO we really need this for each menuItem, or should just create a wrapper & it will decide WTS
            }, {
                key: 'view-item',
                name: 'View Menu & Variants',
                subSetting: ViewMenuItemSetting,
                isSelected: false // DO we really need this for each menuItem, or should just create a wrapper & it will decide WTS
            }, {
                key: 'edit-item',
                name: 'Edit Item',
                subSetting: EditMenuItemSetting,
                isSelected: false // DO we really need this for each menuItem, or should just create a wrapper & it will decide WTS
            } ,
            {
                key: 'add-variant',
                name: 'Add Variant',
                subSetting: AddNewMenuItemVariantSetting,
                isSelected: false // DO we really need this for each menuItem, or should just create a wrapper & it will decide WTS
            }, {
                key: 'edit-variant',
                name: 'Edit Variant',
                subSetting: EditMenuItemVariantSetting,
                isSelected: false // DO we really need this for each menuItem, or should just create a wrapper & it will decide WTS
            }
        ],
        menuListId: SettingColumns.COLUMN2
    }
}
