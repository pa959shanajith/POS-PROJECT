import React, {useEffect, useState} from "react";
import "../../assets/scss/pages/add-employee.scss";
import {ISettingField} from "../../constants/constant";
import GenericSettingForm from "./GenericSettingForm";
import EmployeeBackendApiService from "../../services/employee-backend-api.service";
import RoleBackendApiService from "../../services/role-backend-api.service";
import {toast} from "react-toastify";
import {AddEmployeeFields} from "../../constants/employee.constants";

// @ts-ignore
const AddEmployee = ({changeNavigation, ...rest}) => {

    const [fields, setFields] = useState(AddEmployeeFields);
    const [roles, setRoles] = useState([]);
    const saveChanges = async (updatedFields: ISettingField[]) => {
        let payload: any = {};
            //Hit API call and redirect to whatever place
        updatedFields.map(field => {
            payload[field.fieldName] = field.value;
        })
        const {data, success, message} = await EmployeeBackendApiService.createEmployee(payload);
        // Finally call the changeNavigation method
        if (success) {
            toast.success(`${data.name} Named Employee Created Successfully!`);
            const resetFields = attachRolesDataToFields(AddEmployeeFields, roles);
            setFields([...resetFields]);
            changeNavigation(rest);
        } else {
            toast.error(message || 'Something went wrong while creating the employee!')
        }
    }

    const getRoles = async () => {
        const res = await RoleBackendApiService.fetchAllRoles();
        if (res.success) {
            const rolesData: any = res.data.map((role: any) => {
                return {
                    value: role.id,
                    label: role.name,
                }
            });
            const updatedFields = attachRolesDataToFields(fields, rolesData);
            setRoles(rolesData);
            setFields([...updatedFields]);
        } else {
            toast.error(res.message);
        }
    }
    const attachRolesDataToFields = (fieldsData: ISettingField[], rolesData: any) => {
        return fieldsData.map(prevField => {
            if (prevField.fieldName === 'roleId') {
                return {
                    ...prevField,
                    data: rolesData,
                }
            } else {
                return prevField;
            }
        });
    }

    useEffect(() => {
        // Get all roles
        getRoles();
    }, []);

    return (
        <GenericSettingForm
            initialFields={fields}
            onSaveChanges={saveChanges}
        />
    )
}

export default AddEmployee;
