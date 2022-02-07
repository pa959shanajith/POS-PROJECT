import MenuList from "../components/settings/MenuList";
import {ISetting, SettingColumns} from "./constant";
import SalesReportComponent from "../components/settings/SalesReportComponent";
import AttendanceReportComponent from "../components/settings/AttendanceReportComponent";
import VoidBillReportComponent from "../components/settings/VoidBillSalesReport";
import ViewTopSellingMenuComponent from "../components/settings/ViewTopSellingMenuComponent";
import ViewAndAddCustomerInfoComponent from "../components/billing/ViewAndAddCustomerInfoComponent";
import ViewMaterialPurchaseComponentReport from "../components/settings/ViewMaterialPurchaseComponentReport";
import ViewStockReportComponent from "../components/settings/ViewStockReportComponent";


export const SalesReportSetting: ISetting = {
    node: SalesReportComponent,
    type: 'COMPONENT',
    data: {},
}

export const AttendanceReportSetting: ISetting = {
    node: AttendanceReportComponent,
    type: 'COMPONENT',
    data: {},
}

export const VoidBillReportSetting: ISetting = {
    node: VoidBillReportComponent,
    type: 'COMPONENT',
    data: {},
}

export const TopSellingReportSetting: ISetting = {
    node: ViewTopSellingMenuComponent,
    type: 'COMPONENT',
    data: {},
}

export const CustomerReportSetting: ISetting = {
    node: ViewAndAddCustomerInfoComponent,
    type: 'COMPONENT',
    data: {},
}

export const MaterialPurchaseReportSetting: ISetting = {
    node: ViewMaterialPurchaseComponentReport,
    type: 'COMPONENT',
    data: {},
}

export const ViewStockReportSetting: ISetting = {
    node: ViewStockReportComponent,
    type: 'COMPONENT',
    data: {},
}


export const ReportMenuList: ISetting = {
    node: MenuList,
    type: 'MENU',
    data: {
        items: [
            {
                key: 'attendance',
                name: 'Attendance',
                subSetting: AttendanceReportSetting,
                backgroundColor: 'green',
                isSelected: false // DO we really need this for each menuItem, or should just create a wrapper & it will decide WTS
            }, {
                key: 'stock-list',
                name: 'Stock List',
                subSetting: ViewStockReportSetting,
                backgroundColor: 'green',
                isSelected: false // DO we really need this for each menuItem, or should just create a wrapper & it will decide WTS
            }, {
                key: 'sales-report',
                name: 'Sales Report',
                subSetting: SalesReportSetting,
                backgroundColor: 'green',
                isSelected: false // DO we really need this for each menuItem, or should just create a wrapper & it will decide WTS
            }, {
                key: 'void-bills',
                name: 'Void Bills',
                subSetting: VoidBillReportSetting,
                backgroundColor: 'green',
                isSelected: false // DO we really need this for each menuExpense, or should just create a wrapper & it will decide WTS
            }, {
                key: 'material-purchase',
                name: 'Material Purchase',
                backgroundColor: 'green',
                subSetting: MaterialPurchaseReportSetting,
                isSelected: false // DO we really need this for each menuItem, or should just create a wrapper & it will decide WTS
            }, {
                key: 'top-selling-menu',
                name: 'Top Selling Menu',
                subSetting: TopSellingReportSetting,
                backgroundColor: 'green',
                isSelected: false // DO we really need this for each menuItem, or should just create a wrapper & it will decide WTS
            }, {
                key: 'customers-list',
                name: 'Customer List',
                subSetting: CustomerReportSetting,
                backgroundColor: 'green',
                isSelected: false // DO we really need this for each menuItem, or should just create a wrapper & it will decide WTS
            }
        ],
        menuListId: SettingColumns.COLUMN2
    }
}
