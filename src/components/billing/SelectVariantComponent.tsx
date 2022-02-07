import React, {useState} from "react";
import {toast} from "react-toastify";
import {getNumber} from "../../services/generic.service";

const SelectVariantComponent = (props: any) => {
    const [selectedVariant, setSelectedVariant] = useState<any>({});
    const getVariantContent = () => {
        let variantsData: any = [{
            id: props.menuItem.id,
            name: props.menuItem.name,
            arabicName: props.menuItem.arabicName,
            sellingPrice: props.menuItem.sellingPrice,
            materials: props.menuItem.materials,
        }];
        props.menuItem.variants.map((v: any) => {
            variantsData.push({
                ...v,
                sellingPrice: getNumber(v.sellingPrice),
                menuItemId: props.menuItem.id,
                materials: [...props.menuItem.materials, ...v.materials]
            })
        })
        return (
            variantsData?.map((variant: any) => (
                <div
                    className={`table ${selectedVariant?.id === variant.id ? 'selected' : ''} ${!variant.menuItemId ? 'original' : ''}`}
                    onClick={() => setSelectedVariant(variant)}
                >
                    <span>{variant.name}</span>
                    {
                        !variant.menuItemId ? (
                            <span className='description'>[Original Item]</span>
                        ) : null
                    }
                </div>
            ))
        )
    }

    const handleSelect = () => {
        if (Object.keys(selectedVariant).length) { // Check if its just a empty object
            props.selectVariant(selectedVariant);
        } else {
            toast.error('Select a variant please!');
        }
    }

    return(
        <div className="select-table-container">
            <div className="select-table-container-header">
                <h2>Select Variant</h2>
            </div>
            <div className="select-table-container-content">
                { !props.menuItem?.variants?.length ? (
                    <div className='no-results'>No variants found for the given menu item!</div>
                ) : (
                    <>
                        <div className="tables">
                            { getVariantContent() }
                        </div>
                        <div className='button-container'>
                            <div
                                className='button cancel'
                                onClick={() => props.cancel()}
                            >
                                Cancel
                            </div>
                            <div
                                className='button ok'
                                onClick={handleSelect}
                            >
                                OK
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default SelectVariantComponent;
