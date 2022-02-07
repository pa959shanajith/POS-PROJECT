export enum SettingColumns {
    COLUMN1 = "column1",
    COLUMN2 = "column2",
    COLUMN3 = "column3"
}

export interface ISettingMap {
    [key: string] : {
        role: string;
        setting: ISetting
    }
}

export interface ISetting {
    node: any;
    type: string;
    data: any;
}

export interface ISettingField {
    fieldName: string;
    label: string;
    groupLabel?: string;
    type: string;
    value: string | boolean | any[];
    group?: string[];
    data?: any;
    disabled?: boolean;
}

export const KeyPadButton = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    ['Del', 0, 'OK'],
]
export const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
