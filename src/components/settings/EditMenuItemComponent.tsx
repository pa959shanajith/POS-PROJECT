import React, {useEffect, useState} from "react";
import "../../assets/scss/pages/add-employee.scss";
import {toast} from "react-toastify";
import MaterialBackendApiService from "../../services/material-backend-api.service";
import InputField from "../base/InputField";
import MenuItemsBackendApiService from "../../services/menu-items-backend-api.service";
import {EditMenuItemFields} from "../../constants/menu-item.constant";

//@ts-ignore
const EditMenuItemComponent = ({changeNavigation}) => {

    const [fields, setFields] = useState(EditMenuItemFields);
    const [allMaterialData, setAllMaterialData] = useState([]);
    const [materials, setMaterials] = useState<any>({});
    const [selectedMenuItem, setSelectedMenuItem] = useState();
    const [allMenuItemsData, setAllMenuItemsData] = useState([]);
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
        const {success, data, message} = await MenuItemsBackendApiService.updateMenuItem({
            ...payload,
        });

        if (success) {
            toast.success(`${payload.name} updated successfully!`)
            changeNavigation();
        } else {
            toast.error(message);
        }
    }

    const getAllInitialData = async () => {
        const { data: menuItemsRes } = await MenuItemsBackendApiService.fetchAllMenuItems();
        const { data: menuCategoryRes } = await MenuItemsBackendApiService.fetchAllMenuCategories();
        const { data: materialsResData } = await MaterialBackendApiService.fetchAllMaterials();

        const menuItemsData: any = menuItemsRes.map((role: any) => {
            return {
                value: role.id, // why not material ID is accepted in Backend?
                label: role.name,
            }
        });

        const materialData: any = materialsResData.map((role: any) => {
            return {
                alreadySelected: false,
                value: role.name,
                label: role.name,
            }
        });

        setFields((prevFields: any) => {
            return prevFields.map((prevField: any) => {
                if (prevField.fieldName === 'id') {
                    return {
                        ...prevField,
                        data: menuItemsData,
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
        setAllMenuItemsData(menuItemsRes);
        setAllMaterialData(materialData);
    }

    const onChangeEventHandler = (e: any) => {
        if (e.target.name === 'id') {
            setSelectedMenuItem(e.target.value);
            return;
        }
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
        let selectedMenuItemObj: any;
        const selectedCategories: string[] = [];
        const updatedMaterials: any = {};
        const updatedMaterialsFields: any = [];

        allMenuItemsData.map((menuItem: any) => {
            if (menuItem.id === selectedMenuItem) {
                selectedMenuItemObj = menuItem;
            }
        });
        if (!selectedMenuItemObj) {
            return;
        }
        const updatedFields = fields.map((field: any) => {
            if (field.fieldName === 'material') {
                // materials
                selectedMenuItemObj.materials.map((material: any, index: number) => {
                    updatedMaterials[`${field.fieldName}${index+1}`] = material;
                    selectedCategories.push(material.materialName);
                    updatedMaterialsFields.push({
                        fieldName: `${field.fieldName}${index+1}`,
                        label: `${field.label}${index+1}`,
                        type: 'group',
                    })
                });

                return {
                    ...field,
                    fields: updatedMaterialsFields || [{
                        fieldName: 'material1',
                        label: 'Material 1',
                        type: 'group',
                    }], // providing fallback to the material list :)
                }
            } else {
                return {
                    ...field,
                    value: selectedMenuItemObj[field.fieldName]
                }
            }
        });
        const updatedAllMaterialsData = allMaterialData.map((material: any) => {
            return {
                ...material,
                alreadySelected: selectedCategories.includes(material.materialName),
            }
        })

        setAllMaterialData(updatedAllMaterialsData);
        setMaterials(updatedMaterials);
        setFields(updatedFields);

    }, [selectedMenuItem]);


    useEffect(() => {
        // Get all roles
        getAllInitialData();
    }, []);

    const groupSelectChangeHandler = (e: any) => {
        // loop over the materials to find if the materials is already in, if its update it
        const materialFieldName = e.target.name.split('-select')[0]; // please wrap this for error
        const materialId = e.target.value;

        const currentlyHaveSomeMaterial = Object.keys(materials).includes(materialFieldName);
        const currentSelectedMaterial = currentlyHaveSomeMaterial ? materials[materialFieldName].materialName : null;
        const updatedMaterials = currentlyHaveSomeMaterial ? {
            ...materials,
            [materialFieldName]: {
                ...materials[materialFieldName],
                materialName: materialId,
            }
        } : {
            ...materials,
            [materialFieldName]: {
                materialName: e.target.value,
                quantity: 0,
            }
        }
        setMaterials(updatedMaterials);

        // Finally make the currently selected material free to be selected somewhere else
        const updatedAllMaterialData = allMaterialData.map((material: any) => {
            if (currentSelectedMaterial && material.value === currentSelectedMaterial) {
                return {
                    ...material,
                    alreadySelected: false,
                }
            } else if (material.value === materialId) {
                return {
                    ...material,
                    alreadySelected: true,
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
        // Add check so that you cant add useless items
        setFields((prevFields: any) => {
            return prevFields.map((prevField: any) => {
                if (prevField.type === 'group') {
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
            })
        });
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
                    return field.fields.map((groupField: any, index: number, self: any) => {
                        return (
                            <div className="add-menu-item-container">
                                <div className={'input-field-container '}>
                                    <span className="input-field-label mukul">{groupField.label}</span>
                                    <div className={'fields'}>
                                        <select
                                            name={`${groupField.fieldName}-select`}
                                            value={materials[groupField.fieldName] ? materials[groupField.fieldName].materialName : null}
                                            onChange={groupSelectChangeHandler}
                                        >
                                            <option>Select an option</option>
                                            {
                                                allMaterialData
                                                    ?.filter((dataItem: any) => {
                                                        if (materials[groupField.fieldName]) {
                                                            return !dataItem.alreadySelected || materials[groupField.fieldName].materialName === dataItem.value
                                                        } else {
                                                            return !dataItem.alreadySelected
                                                        }
                                                    })
                                                    .map((dataItem: any) => {
                                                        return (
                                                            <option value={dataItem.value}>{dataItem.label}</option>
                                                        )
                                                    })
                                            }
                                        </select>
                                        <input
                                            className={"small-input"}
                                            name={groupField.fieldName}
                                            value={materials[groupField.fieldName] ? materials[groupField.fieldName].quantity : null}
                                            type={'number'}
                                            disabled={!materials[groupField.fieldName]}
                                            onChange={groupQuantityChangeHandler}
                                        />
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
                        )
                    })
                }
            })}
            <div className="button-container" onClick={saveChanges}>
                <span className="button">SAVE</span>
            </div>
        </div>
    )
}

export default EditMenuItemComponent;
