import ViewRoleComponent from "../components/settings/ViewRoleComponent";
import EditRoleComponent from "../components/settings/EditRoleComponent";
import CreateRole from "../components/settings/CreateRole";
import {ISetting} from "./constant";
import {IRoleData} from "../services/role-backend-api.service";

export const ViewRoleSetting: ISetting = {
    node: ViewRoleComponent,
    type: 'COMPONENT',
    data: {}
}

export const EditRoleSetting: ISetting = {
    node: EditRoleComponent,
    type: 'COMPONENT',
    data: {}
}

export const AddRoleSetting: ISetting = {
    node: CreateRole,
    type: 'COMPONENT',
    data: {
        nextSetting: ViewRoleSetting,
    }
}


export const accessList: Array<{ id: keyof IRoleData; name: string}> = [
    {
        id: "editEmployee",
        name: "Add/ Edit Employee"
    }, {
        id: "editSession",
        name: "Open Close Session"
    }, {
        id: "viewEmployee",
        name: "View Employee"
    }, {
        id: "deleteBill",
        name: "Delete Bill"
    }, {
        id: "editMaterial",
        name: "Add/ Edit Material"
    },     {
        id: "addBill",
        name: "Add Bill"
    }, {
        id: "viewMaterial",
        name: "View Material"
    }, {
        id: "accessSettings",
        name: "Access to Settings"
    }, {
        id: "editMenuItem",
        name: "Add/ Edit Menu Item"
    }, {
        id: "minimizePOS",
        name: "minimize-pos"
    }, {
        id: "viewMenuItem",
        name: "View Menu Item"
    }, {
        id: "editInventory",
        name: "Add/ Edit Inventory"
    }, {
        id: "editPOSSettings",
        name: "Edit POS Settings"
    }, {
        id: "viewInventory",
        name: "View Inventory"
    }, {
        id: "viewPOSSettings",
        name: "View POS Settings"
    }, {
        id: "editExpense",
        name: "Add/ Edit Expenses"
    }, {
        id: "viewReports",
        name: "View Reports"
    }, {
        id: "viewExpense",
        name: "View Expenses"
    }
]
