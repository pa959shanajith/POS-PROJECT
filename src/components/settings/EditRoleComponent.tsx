import React, {useEffect, useState} from "react";
import "../../assets/scss/pages/create-role.scss";
import RoleBackendApiService, {IRoleData} from "../../services/role-backend-api.service";
import {accessList} from "../../constants/role.constants";
import InputField from "../base/InputField";
import {toast} from "react-toastify";

const initialConfig: IRoleData = {
    name: "",
    shopId: "", // updated in service file
    editEmployee: false,
    viewEmployee: false,
    editMaterial: false,
    viewMaterial: false,
    editMenuItem: false,
    viewMenuItem: false,
    editPOSSettings: false,
    viewPOSSettings: false,
    viewReports: false,
    editSession: false,
    addBill: false,
    deleteBill: false,
    accessSettings: false,
    minimizePOS: false,
    editInventory: false,
    viewInventory: false,
    editExpense: false,
    viewExpense: false
}

const EditRoleComponent = () => {
    const [fields, setFields] = useState<any>(accessList);
    const [config, setConfig] = useState<IRoleData>(initialConfig);
    const [rolesData, setRolesData] = useState([]);
    const [rolesOptionData, setRolesOptionData] = useState([]);
    const [selectedRole, setSelectedRole] = useState();

    const onChangeHandler = (e: any) => {
        const roleId = e.target.value;
        let selectedRole: any;
        rolesData.some(role => {
            if (role.id === roleId) {
                selectedRole = role;
                return true;
            }
            return false;
        });
        let updatedConfig: any = {};
        const updatedFields: any = fields.map((field: any) => {
            updatedConfig[field.id] = selectedRole[field.id];
            return {
                ...field,
                value: selectedRole[field.id]
            }
        });
        setFields(updatedFields);
        setConfig(updatedConfig);
        setSelectedRole(roleId);
    }
    const updateConfigValue = (id : keyof IRoleData) => {
        setConfig((prevConfig) => {
            return {
                ...prevConfig,
                [id]: !prevConfig[id],
            }
        });
        const updatedFields: any = fields.map((field: any) => {
            return {
                ...field,
                value: field.id === id ? !field.value : field.value,
            }
        });
        setFields(updatedFields);
    }
    const handleEditRole = async () => {
        const res = await RoleBackendApiService.updateRole({
            ...config,
            id: selectedRole
        });
        if (res.success) {
            toast.success(`Role updated Successfully!`);
            setConfig(initialConfig);
        } else {
            toast.error(res.message);
        }
    }

    const getAllRoles = async () => {
        const rolesRes = await RoleBackendApiService.fetchAllRoles();
        if (rolesRes.success) {
            const rolesOptions = rolesRes.data.map((role:any) => {
                return {
                    label: role.name,
                    value: role.id,
                }
            })
            setRolesData(rolesRes.data);
            setRolesOptionData(rolesOptions);
        } else {
            toast.error(rolesRes.message);
        }
    }

    useEffect(() => {
        // Get all roles
        getAllRoles();
    }, []);

    return (
        <div className="create-role-container pos-blue-box-cont">
            <div className="create-role-content">
                <InputField
                    field={{
                        fieldName: "name",
                        type: "dropdown",
                        label: "Role Name",
                        data: rolesOptionData,
                        value: selectedRole
                    }}
                    onChangeHandler={onChangeHandler}
                />
                <div className="access-container">
                    {
                        fields.map((field: any) => {
                            return (
                                <label>
                                    <input
                                        type="checkbox"
                                        name={field.id}
                                        id={field.id}
                                        checked={!!field.value}
                                        onChange={() => updateConfigValue(field.id)}
                                    />
                                    <span>{field.name}</span>
                                </label>
                            )
                        })
                    }
                </div>
            </div>
            <button className="button-container" onClick={handleEditRole}>
                <span className="button">SAVE</span>
            </button>
        </div>
    );
}

export default EditRoleComponent;
