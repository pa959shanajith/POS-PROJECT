import React, {useState} from "react";
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

const CreateRole = () => {
    const [config, setConfig] = useState<IRoleData>(initialConfig);
    const onChangeHandler = (e: any) => {
        setConfig(prevConfig => {
            return {
                ...prevConfig,
                name: e.target.value,
            }
        })
    }
    const updateConfigValue = (id : keyof IRoleData) => {
        setConfig((prevConfig) => {
            return {
                ...prevConfig,
                [id]: !prevConfig[id],
            }
        })
    }
    const handleCreateRole = async () => {
        const res = await RoleBackendApiService.createRole(config);
        if (res.success) {
            toast.success(`${config.name} Role Created Successfully!`);
            setConfig(initialConfig);
        } else {
            toast.error(res.message);
        }
    }
    return (
        <div className="create-role-container pos-blue-box-cont">
            <div className="create-role-content">
                <InputField
                    field={{
                        fieldName: "name",
                        type: "text",
                        label: "Role Name",
                        value: config.name
                    }}
                    onChangeHandler={onChangeHandler}
                />
                <div className="access-container">
                    {
                        accessList.map(accessItem => {
                            return (
                                <label>
                                    <input
                                        type="checkbox"
                                        name={accessItem.id}
                                        id={accessItem.id}
                                        checked={!!config[accessItem.id]}
                                        onChange={() => updateConfigValue(accessItem.id)}
                                    />
                                    <span>{accessItem.name}</span>
                                </label>
                            )
                        })
                    }
                </div>
            </div>
            <button className="button-container" onClick={handleCreateRole}>
                <span className="button">SAVE</span>
            </button>
        </div>
    );
}

export default CreateRole;
