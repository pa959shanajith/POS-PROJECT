import React, {useRef, useState} from "react";
import DatePicker from "react-datepicker";
import dayjs from "dayjs";
import {UploadOutlined} from "@ant-design/icons";
import "../../assets/scss/base/input-field.scss";
import POS_DEFAULT_LOGO from "../../assets/images/pos-logo.jpeg";

export interface IInputField {
    field: {
        label: string;
        groupLabel?: string;
        fieldName: string;
        type: string;
        value: string | boolean | any[];
        group?: string[];
        data?: any[];
        disabled?: boolean;
    }
    onChangeHandler: (e: any) => void;
    addMoreGroupItem?: (groupName: string) => void;
    fileInputFieldChange?: (data: {fieldName: string, file: File}) => void;
}

const InputField = (props: IInputField) => {
    const [localImageUrl, setLocalImageUrl] = useState();

    const fileUploadInputRef = useRef();

    const onFileUpload = (e: any) => {
        // @ts-ignore
        setLocalImageUrl(URL.createObjectURL(e.target.files[0]))
        props.fileInputFieldChange({
            fieldName: props.field.fieldName,
            file: e.target.files[0]
        })
    }

    let parsedDate;
    if (props.field.type === 'date') {
        parsedDate = props.field.value && dayjs(props.field.value as string).isValid() ? new Date(props.field.value as string) : null;
    }
    return (
        <div className="input-field-container">
            <span className="input-field-label">{props.field.label}</span>
            {props.field.type === 'text' && (
                <input
                    className={"fields"}
                    name={props.field.fieldName}
                    value={props.field.value as string}
                    disabled={props.field.disabled}
                    onChange={props.onChangeHandler}
                />
            )}
            {props.field.type === 'date' && (
                <div className={'fields'}>
                    <DatePicker
                        onChange={(date) => {
                            props.onChangeHandler({
                                target: {
                                    name: props.field.fieldName,
                                    value: dayjs(date as Date).format('MM-DD-YYYY')
                                }
                            })
                        }}
                        maxDate={new Date()}
                        selected={parsedDate} // FORMAT MUST BE MM-DD-YYYY
                    />
                </div>
            )}
            {props.field.type === 'checkbox' && (
                <label className={"checkbox fields"}>
                    <input
                        type="checkbox"
                        key={props.field.fieldName}
                        name={props.field.fieldName}
                        checked={props.field.value as boolean}
                        onChange={props.onChangeHandler}
                    />
                </label>
            )}
            {props.field.type === 'dropdown' && (
                <select className={"fields"} name={props.field.fieldName} onChange={props.onChangeHandler}>
                    <option selected={!props.field.value}>Select an option</option>
                    {
                        props.field.data?.filter(dataItem => !dataItem.hideOption)?.map(dataItem => {
                            // console.log('disabledOption', dataItem.disabledOption, dataItem.label)
                            return (
                                <option
                                    disabled={dataItem.disabledOption}
                                    value={dataItem.value}
                                    id={dataItem.id}
                                    selected={dataItem.value === props.field.value}
                                >{dataItem.label}</option>
                            )
                        })
                    }
                </select>
            )}
            {props.field.type === 'textarea' && (
                <textarea
                    className={"fields"}
                    name={props.field.fieldName}
                    value={props.field.value as string}
                    onChange={props.onChangeHandler}
                />
            )}
            {
                props.field.type === 'image' && (
                    <div className="image-field-container">
                        <div className="image-container">
                            {
                                localImageUrl
                                    ? <img className="responsive-img" src={localImageUrl} alt={'user-img'}/>
                                    : <img className="responsive-img"
                                           src={props.field.value && typeof props.field.value === 'string'
                                               ? `${props.field.value}`
                                               : POS_DEFAULT_LOGO}
                                           alt={'user-img'}
                                    />
                            }
                        </div>
                        <div className="upload-btn-container">
                            <input
                                className="center-align hide"
                                type="file"
                                onChange={onFileUpload}
                                ref={fileUploadInputRef}
                            />
                            <button
                                className="button"
                                name="upload-img"
                                onClick={() => {
                                    // @ts-ignore
                                    fileUploadInputRef.current.click()
                                }}
                            ><UploadOutlined/></button>
                        </div>
                    </div>
                )
            }
        </div>
    );
}
export default InputField;
