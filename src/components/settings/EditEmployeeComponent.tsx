import React, {useEffect, useState} from "react";
import "../../assets/scss/pages/add-employee.scss";
import {ISettingField} from "../../constants/constant";
import GenericSettingForm from "./GenericSettingForm";
import EmployeeBackendApiService from "../../services/employee-backend-api.service";
import RoleBackendApiService from "../../services/role-backend-api.service";
import {toast} from "react-toastify";
import {EditEmployeeFields} from "../../constants/employee.constants";

// @ts-ignore
const EditEmployeeComponent = ({changeNavigation}) => {

    const [fields, setFields] = useState(EditEmployeeFields);
    const [roles, setRoles] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [employeesData, setEmployeesData] = useState([]);
    const saveChanges = async (updatedFields: ISettingField[]) => {
        let payload: any = {};
        //Hit API call and redirect to whatever place
        updatedFields.map(field => {
            payload[field.fieldName] = field.value;
        });
        const {data, success, message} = await EmployeeBackendApiService.updateEmployee(payload);
        // Finally call the changeNavigation method
        if (success) {
            toast.success(`Employee Named as ${data.name} Updated Successfully!`);
            const resetFields = attachRolesAndEmployeesDataToFields(EditEmployeeFields, roles, employees);
            setFields([...resetFields]);
            changeNavigation();
        } else {
            toast.error(message);
        }
    }

    const getEmployeesAndRoles = async () => {
        const rolesRes = await RoleBackendApiService.fetchAllRoles();
        const {data: employeesResData} = await EmployeeBackendApiService.fetchAllEmployees();
        if (rolesRes.success) {
            const rolesData: any = rolesRes.data.map((role: any) => {
                return {
                    value: role.id,
                    label: role.name,
                }
            });
            const employeesData: any = employeesResData.map((role: any) => {
                return {
                    value: role.id,
                    label: role.name,
                }
            });
            const updatedFields = attachRolesAndEmployeesDataToFields(fields, rolesData, employeesData);
            setRoles(rolesData);
            setEmployees(employeesData);
            setEmployeesData(employeesResData)
            setFields([...updatedFields]);
        } else {
            toast.error(rolesRes.message);
        }
    }

    const attachRolesAndEmployeesDataToFields = (fieldsData: ISettingField[], rolesData: any, employeesData: any) => {
        return fieldsData.map(prevField => {
            if (prevField.fieldName === 'roleId') {
                return {
                    ...prevField,
                    data: rolesData,
                }
            } else if (prevField.fieldName === 'id') {
                return {
                    ...prevField,
                    data: employeesData,
                }
            } else {
                return prevField;
            }
        });
    }

    const onChangeEventHandler = (e: any) => {
        if (e.target.name === 'id') {
            const EmployeeId = e.target.value;
            // get the employee details
            let selectedEmployee: any;
            employeesData.some(employee => {
                if (employee.id === EmployeeId) {
                    selectedEmployee = employee;
                    return true;
                }
                return false;
            });
            // Loop over fields to attach the values
            const updatedFields: any = fields.map(field => {
                if (field.fieldName === 'roleId') {
                    return {
                        ...field,
                        value: selectedEmployee['RoleId'], // TODO BE key should be roleId, currently its RoleId
                    }
                } else {
                    return {
                        ...field,
                        value: selectedEmployee[field.fieldName]
                    }
                }
            });
            setFields([...updatedFields]);
        }
    }

    useEffect(() => {
        // Get all roles
        getEmployeesAndRoles();
    }, []);

    return (
        <GenericSettingForm
            initialFields={fields}
            onSaveChanges={saveChanges}
            onChangeEvent={onChangeEventHandler}
        />
    )
}

export default EditEmployeeComponent;
