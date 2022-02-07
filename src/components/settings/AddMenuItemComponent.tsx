import React, {useEffect, useState} from "react";
import "../../assets/scss/pages/add-employee.scss";
import {toast} from "react-toastify";
import MaterialBackendApiService from "../../services/material-backend-api.service";
import InputField from "../base/InputField";
import MenuItemsBackendApiService from "../../services/menu-items-backend-api.service";
import {AddNewMenuItemFields} from "../../constants/menu-item.constant";

//@ts-ignore
const AddMenuItemComponent = ({changeNavigation}) => {
    const [fields, setFields] = useState(AddNewMenuItemFields);
    const [allMaterialData, setAllMaterialData] = useState([]);
    const [showRemoveIcon, setShowRemoveIcon] = useState(false)
    const [materials, setMaterials] = useState<any>({});

    const saveChanges = async () => {
        const payload: any = {
            materials: Object.keys(materials).map(materialsKey => materials[materialsKey]),
        };
        fields.map((field: any) => {
            if (!field.disabled && field.type !== 'group') {
                payload[field.fieldName] = field.value
            }
        });
        //Hit API call and redirect to whatever place
        const {success, data, message} = await MenuItemsBackendApiService.createMenuItem({
            ...payload,
        });
        if (success) {
            toast.success(`${payload.name} updated successfully!`)
            changeNavigation();
        } else {
            toast.error(message);
        }
    }

    const getAllMaterials = async () => {
        const {data: menuCategoryRes} = await MenuItemsBackendApiService.fetchAllMenuCategories();
        const materialsRes = await MaterialBackendApiService.fetchAllMaterials();
        const menuCategoryData: any = menuCategoryRes?.map((role: any) => {
            return {
                value: role.id, // why not material ID is accepted in Backend?
                label: role.name,
            }
        });
        const materialData: any = materialsRes?.data?.map((material: any) => {
            return {
                alreadySelected: false,
                value: material.id,
                label: material.name,
                units: material.units,
            }
        });

        setFields((prevFields: any) => {
            return prevFields.map((prevField: any) => {
                if (prevField.fieldName === 'menuItemCategoryId') {
                    return {
                        ...prevField,
                        data: menuCategoryData,
                    }
                } else if (prevField.type === 'group') {
                    return {
                        ...prevField,
                        fields: prevField.fields.map((groupField: any) => {
                            return {
                                ...groupField,
                                data: materialData,
                            }
                        })
                    }
                } else {
                    return prevField;
                }
            })
        });
        setAllMaterialData(materialData);
    }

    const onChangeEventHandler = (e: any) => {
        const updatedFields = fields.map((field: any) => {
            if (field.fieldName === e.target.name) {
                return {
                    ...field,
                    value: field.type === 'checkbox' ? e.target.checked : e.target.value,
                }
            } else {
                return field;
            }
        });
        setFields([...updatedFields]);
    }
    useEffect(() => {
        // Get all roles
        getAllMaterials();
    }, []);

    const groupSelectChangeHandler = (materialId: string, fieldName: string ) => {
        let materialName = '';
        let materialUnits = '';
        allMaterialData.some(mat => {
            if (mat.value === materialId) {
                materialName = mat.label;
                materialUnits = mat.units;
                return true;
            }
            return false;
        })
        // loop over the materials to find if the materials is already in, if its update it
        const currentlySelected = Object.keys(materials).includes(fieldName);
        // Just change the name, as Qty will be the one earlier user typed in for the corresponding input
        // Else just add qty as 0
        const updatedMaterials = {
            ...materials,
            [fieldName]: {
                quantity: currentlySelected ? materials[fieldName].quantity : 0,
                materialName,
                materialId,
                units: materialUnits,
            }
        }
        setMaterials(updatedMaterials);
        updateAllMaterialData(materialId, currentlySelected);
    }

    const updateAllMaterialData = (materialId: string, currentlySelected: boolean = false) => {
        // Finally make the currently selected material free to be selected somewhere else
        const updatedAllMaterialData = allMaterialData.map((material: any) => {
            // Reset the currently selected material
           if (material.value === materialId) {
                return {
                    ...material,
                    alreadySelected: !currentlySelected,
                }
            } else {
                return material;
            }
        });
        setAllMaterialData(updatedAllMaterialData);
    }

    const groupQuantityChangeHandler = (e: any) => {
        const materialName = e.target.name;
        const quantity = e.target.value;
        const materialExists = Object.keys(materials).includes(materialName);
        if (materialExists) {
            setMaterials((prevState: any) => {
                return  {
                    ...prevState,
                    [materialName]: {
                        ...prevState[materialName],
                        quantity,
                    }
                }
            });
        }
    }

    const addMoreGroupItem = () => {
        let groupIndex: number = -1;
        // Add check so that you cant add useless items
        const updatedFields = fields.map((prevField: any, idx: number) => {
            if (prevField.type === 'group') {
                groupIndex = idx;
                return {
                    ...prevField,
                    fields: [...prevField.fields, {
                        fieldName: `material${prevField.fields.length + 1}`,
                        label: `Material ${prevField.fields.length + 1}`,
                        type: 'group',
                        value: {materialName: '', quantity: ''},
                        data: allMaterialData,
                    }]
                }
            } else {
                return prevField;
            }
        });
        setFields(updatedFields);
        if (groupIndex !== -1) {
            setShowRemoveIcon(updatedFields[groupIndex].fields.length > 1);
        }
    }

    const removeGroupItem = (fieldLabel: string) => {
        let groupIndex: number = -1;
        // Add check so that you cant add useless items
        let resetMaterialId: string;
        let updatedMaterials: any = {};
        const updatedFields = fields.map((prevField: any, idx: number) => {
            if (prevField.type === 'group') {
                groupIndex = idx;
                let fieldsWithUpdatedNames = prevField.fields
                    .filter((field: any) => {
                        if (fieldLabel === field.label) {
                            resetMaterialId = materials[field.fieldName]?.materialName;
                            if (resetMaterialId) delete materials[field.fieldName];
                            return false;
                        }
                        return true;
                    })
                    .map((fieldName: any, idx: number) => {
                        if (materials[fieldName.fieldName]) {
                            updatedMaterials[`material${idx + 1}`] = materials[fieldName.fieldName];
                        }
                        return {
                            ...fieldName,
                            fieldName: `material${idx + 1}`,
                            label: `Material ${idx + 1}`,
                        }
                    });
                return {
                    ...prevField,
                    fields: fieldsWithUpdatedNames,
                }
            } else {
                return prevField;
            }
        });
        setMaterials(updatedMaterials);
        if (resetMaterialId) {
             updateAllMaterialData(resetMaterialId, true);
        }
        if (groupIndex !== -1) {
            setShowRemoveIcon(updatedFields[groupIndex].fields.length > 1);
        }
        setFields(updatedFields);
    }

    return (
        <div className="pos-blue-box-cont">
            {fields.map((field: any) => {
                if (field.type !== 'group') {
                    return (
                        <InputField
                            field={field}
                            onChangeHandler={onChangeEventHandler}
                        />
                    )
                } else {
                    return field.fields.map((groupField: any, index: number, self: any) => (
                        <div className="add-menu-item-container">
                            <div className={'input-field-container '}>
                                <span className="input-field-label">{groupField.label}</span>
                                <div className={'fields'}>
                                    <select
                                        name={`${groupField.fieldName}-select`}
                                        value={materials[groupField.fieldName] ? materials[groupField.fieldName].materialId : null}
                                        onChange={(e) => groupSelectChangeHandler(e.target.value, groupField.fieldName )}
                                    >
                                        <option value={null} selected={!!materials[groupField.fieldName]?.materialName}>Select an option</option>
                                        {
                                            allMaterialData
                                                ?.filter((dataItem: any) => {
                                                    if (materials[groupField.fieldName]) {
                                                        return !dataItem.alreadySelected || materials[groupField.fieldName].materialId === dataItem.value
                                                    } else {
                                                        return !dataItem.alreadySelected
                                                    }
                                                })
                                                .map((dataItem: any) => (
                                                    <option
                                                        value={dataItem.value}
                                                        selected={materials[groupField.fieldName]?.materialId === dataItem.value}
                                                    >{dataItem.label}</option>
                                                ))
                                        }
                                    </select>
                                    <input
                                        className={"small-input"}
                                        name={groupField.fieldName}
                                        value={materials[groupField.fieldName] ? materials[groupField.fieldName].quantity : 0}
                                        type={'number'}
                                        disabled={!materials[groupField.fieldName]}
                                        onChange={groupQuantityChangeHandler}
                                    />
                                    <input
                                        className={"medium-input"}
                                        value={materials[groupField.fieldName] ? materials[groupField.fieldName].units : null}
                                        disabled
                                    />
                                    {showRemoveIcon && (
                                        <div className={'remove-item-cont'}
                                             onClick={() => removeGroupItem(groupField.label)}>
                                            <span>X</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {
                                index === self.length - 1 && (
                                    <div className={'add-group-button'}>
                                        <button
                                            onClick={() => addMoreGroupItem()}
                                        >Add {field.groupLabel}</button>
                                    </div>
                                )
                            }
                        </div>
                    ))
                }
            })}
            <div className="button-container" onClick={saveChanges}>
                <span className="button">SAVE</span>
            </div>
        </div>
    )
}

export default AddMenuItemComponent;
