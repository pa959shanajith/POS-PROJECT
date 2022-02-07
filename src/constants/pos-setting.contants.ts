import MenuList from "../components/settings/MenuList";
import {ISetting, ISettingField, SettingColumns} from "./constant";
import SetupPOSPrinter from "../components/settings/SetupPOSPrinter";
import BasicSetupPOS from "../components/settings/BasicSetupPOS";
import BillTemplatePOS from "../components/settings/BillTemplatePOS";
import SetupTablePOS from "../components/settings/SetupTablePOS";
import EditTablePOSComponent from "../components/settings/EditTablePOSComponent";
import ViewPOSTablesComponent from "../components/settings/ViewPOSTablesComponent";
import EmailSetupPOS from "../components/settings/EmailSetupPOS";


export const SetupPrinterSetting: ISetting = {
    node: SetupPOSPrinter,
    type: 'COMPONENT',
    data: {},
}

export const BasicSetupPOSSetting: ISetting = {
    node: BasicSetupPOS,
    type: 'COMPONENT',
    data: {},
}

export const EmailSetupPOSSetting: ISetting = {
    node: EmailSetupPOS,
    type: 'COMPONENT',
    data: {},
}

export const BillTemplatePOSSetting: ISetting = {
    node: BillTemplatePOS,
    type: 'COMPONENT',
    data: {},
}

export const SetupTablePOSSetting: ISetting = {
    node: SetupTablePOS,
    type: 'COMPONENT',
    data: {},
}

export const EditTablePOSSetting: ISetting = {
    node: EditTablePOSComponent,

    type: 'COMPONENT',
    data: {},
}

export const ViewTablePOSSetting: ISetting = {
    node: ViewPOSTablesComponent,
    type: 'COMPONENT',
    data: {},
}


export const POSSettingMenuItems: ISetting = {
    node: MenuList,
    type: 'MENU',
    data: {
        items: [
            {
                key: 'basic-setup',
                name: 'Basic Setup',
                subSetting: BasicSetupPOSSetting,
                isSelected: false // DO we really need this for each menuItem, or should just create a wrapper & it will decide WTS
            },{
                key: 'email-setup',
                name: 'Email Setup',
                subSetting: EmailSetupPOSSetting,
                isSelected: false // DO we really need this for each menuItem, or should just create a wrapper & it will decide WTS
            }, {
                key: 'setup-printers',
                name: 'Setup Printers',
                subSetting: SetupPrinterSetting,
                isSelected: false // DO we really need this for each menuItem, or should just create a wrapper & it will decide WTS
            }, {
                key: 'add-table',
                name: 'Add Tables',
                subSetting: SetupTablePOSSetting,
                isSelected: false // DO we really need this for each menuItem, or should just create a wrapper & it will decide WTS
            }, {
                key: 'edit-table',
                name: 'Edit Tables',
                subSetting: EditTablePOSSetting,
                isSelected: false // DO we really need this for each menuItem, or should just create a wrapper & it will decide WTS
            }, {
                key: 'view-table',
                name: 'View Tables',
                subSetting: ViewTablePOSSetting,
                isSelected: false // DO we really need this for each menuItem, or should just create a wrapper & it will decide WTS
            }, {
                key: 'bill-templates',
                name: 'Bill Templates',
                subSetting: BillTemplatePOSSetting,
                isSelected: false // DO we really need this for each menuItem, or should just create a wrapper & it will decide WTS
            }
        ],
        menuListId: SettingColumns.COLUMN2
    }
}


export const SetupTablePOSFields =  [
    {
        fieldName: 'name',
        label: 'Table Name',
        type: 'text',
        value: ''
    }, {
        fieldName: 'description',
        label: 'Description',
        type: 'textarea',
        value: ''
    }, {
        fieldName: 'noOfPerson',
        label: 'Number of Person',
        type: 'text',
        value: ''
    },
]

export const EditTablePOSFields: ISettingField[] =  [
    {
        fieldName: 'id',
        label: 'Select Table',
        type: 'dropdown',
        data: [],
        value: ''
    },
    {
        fieldName: 'name',
        label: 'Table Name',
        type: 'text',
        value: ''
    }, {
        fieldName: 'description',
        label: 'Description',
        type: 'textarea',
        value: ''
    }, {
        fieldName: 'noOfPerson',
        label: 'Number of Person',
        type: 'text',
        value: ''
    },
]


export const BasicSetupPOSFields = [
    {
        fieldName: 'name',
        label: 'Shop Name',
        type: 'text',
        value: ''
    }, {
        fieldName: 'currency',
        label: 'Currency',
        type: 'text',
        value: ''
    },  {
        fieldName: 'storeId',
        label: 'Attached Store', // TODO maybe we should start adding info below fields also
        type: 'dropdown',
        data: [],
        value: ''
    },{
        fieldName: 'logo',
        label: 'Logo',
        type: 'image',
        value: ''
    }, {
        fieldName: 'timeFormat',
        label: 'Time Format',
        type: 'dropdown',
        data: [
            {
                value: '24HR',
                label: '24HR',
            },
            {
                value: '12HR',
                label: '12HR',
            }],
        value: ''
    }, {
        fieldName: 'enableScanner',
        label: 'Enable Scanner',
        type: 'dropdown',
        data: [{
            value: true,
            label: 'YES',
        },{
            value: false,
            label: 'NO',
        }],
        value: ''
    },
]

export const EmailSetupPOSFields = [
    {
        fieldName: 'senderEmail',
        label: 'Sender Email',
        type: 'text',
        value: '',
    }, {
        fieldName: 'password',
        label: 'Email Password',
        type: 'text',
        value: '',
    }, {
        fieldName: 'ccEmails',
        label: 'CC Emails(comma seperated)',
        type: 'text',
        value: '',
    }, {
        fieldName: '',
        label: 'Send Email Alert on',
        type: 'label',
        value: '',
    },{
        fieldName: 'stockPurchaseDifference',
        label: 'Stock Purchase difference',
        type: 'dropdown',
        data: [ {
            value: true,
            label: 'YES',
        },{
            value: false,
            label: 'NO',
        } ],
        value: ''
    },{
        fieldName: 'billRefund',
        label: 'Bill Refund',
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
    {
        fieldName: 'voidBill',
        label: 'Void Bill',
        type: 'dropdown',
        data: [ {
            value: true,
            label: 'YES',
        },{
            value: false,
            label: 'NO',
        } ],
        value: ''
    }, {
        fieldName: 'discountedBill',
        label: 'Discounted Bill',
        type: 'dropdown',
        data: [ {
            value: true,
            label: 'YES',
        },{
            value: false,
            label: 'NO',
        } ],
        value: ''
    }, {
        fieldName: 'sessionClose',
        label: 'Session Close',
        type: 'dropdown',
        data: [ {
            value: true,
            label: 'YES',
        },{
            value: false,
            label: 'NO',
        } ],
        value: ''
    }, {
        fieldName: 'monthlyReport',
        label: 'Monthly Report',
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
]

export const SetupPOSPrinterFields = [
    {
        fieldName: 'name',
        label: 'Printer Name',
        type: 'text',
        value: ''
    }, {
        fieldName: 'description',
        label: 'Description',
        type: 'textarea',
        value: ''
    },  {
        fieldName: 'ipAddress',
        label: 'IP Address',
        type: 'text',
        value: ''
    }
]

export const BillTemplatePOSFields =  [
    {
        fieldName: 'billLogo',
        label: 'Logo',
        type: 'image',
        value: ''
    }, {
        fieldName: 'billHeader',
        label: 'Header',
        type: 'textarea',
        value: ''
    }, {
        fieldName: 'billFooter',
        label: 'Footer',
        type: 'textarea',
        value: ''
    },
]
