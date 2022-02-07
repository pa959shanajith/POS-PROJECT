import React from "react";
import "../../assets/scss/components/menu-list.scss";
import {ISetting, SettingColumns} from "../../constants/constant";

export interface MenuListItem {
    key: string;
    name: string;
    isSelected: boolean;
    backgroundColor?: string;
    subItemList?: Array<any>;
    childItem?: any;
    subSetting?: ISetting;
}

export interface IProps {
    items: MenuListItem[];
    menuClickHandler: (item: MenuListItem, menuListId: SettingColumns) => void;
    menuListId: SettingColumns;
}

const MenuList = (props: IProps)=>{
    return(
        <div className="menu-list-container" id={props.menuListId}>
            {
                props.items.map(item => {
                    return (
                        <div
                            key={item.key}
                            className={`menu-list-item ${item.isSelected && 'menu-list-item-selected'} ${item.backgroundColor || ''}`}
                            onClick={() => props.menuClickHandler(item, props.menuListId)}
                        >
                            <span>{item.name}</span>
                        </div>
                    )
                })
            }
        </div>
    );
};

export default MenuList;
