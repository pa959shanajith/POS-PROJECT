import MenuList, {MenuListItem} from "../components/settings/MenuList";
import {EmployeesMenuSetting} from "./employee.constants";
import {MaterialMenuList} from "./material.constants";
import {StoreMenuList} from "./store.constants";
import {MenuItemsMenuList} from "./menu-item.constant";
import {POSSettingMenuItems} from "./pos-setting.contants";
import {StockMenuItems} from "./stock.constants";
import {ExpensesMenuList} from "./expense.constants";
import {ReportMenuList} from "./report.constants";
import {ISettingMap, SettingColumns} from "./constant";

export const primaryMenuData: MenuListItem[] = [{
    key: 'employees',
    name: "Employees",
    subSetting: EmployeesMenuSetting,
    isSelected: false,
}, {
    key: 'materials',
    name: "Materials & Units",
    subSetting: MaterialMenuList,
    isSelected: false,
}, {
    key: 'stores',
    name: "Stores",
    subSetting: StoreMenuList,
    isSelected: false,
}, {
    key: 'menu-items',
    name: "Menu Items",
    subSetting: MenuItemsMenuList,
    isSelected: false,
}, {
    key: 'pos',
    name: "POS",
    subSetting: POSSettingMenuItems,
    isSelected: false,
}, {
    key: 'stock',
    name: "Stock",
    subSetting: StockMenuItems,
    isSelected: false,
}, {
    key: 'expenses',
    name: "Expenses",
    subSetting: ExpensesMenuList,
    isSelected: false,
},{
    key: 'reports',
    name: "Reports",
    subSetting: ReportMenuList,
    backgroundColor: 'orange',
    isSelected: false,
}];

export const SettingsMap: ISettingMap = {
    ADMIN: {
        role: 'admin',
        setting: {
            node: MenuList,
            type: 'MENU',
            data: {
                items: primaryMenuData,
                menuListId: SettingColumns.COLUMN1
            }
        }
    }
}
