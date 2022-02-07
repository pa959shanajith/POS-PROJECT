import React, {useState} from "react";
import "../assets/scss/pages/home.scss";
import {withRouter} from "react-router-dom";
import Layout from "../components/base/Layout";
import MenuList, {MenuListItem} from "../components/settings/MenuList";
import {ISetting, SettingColumns} from "../constants/constant";
import {SettingsMap} from "../constants/primary.constants";
import CloseSessionButtonComponent from "./CloseSessionButtonComponent";
import _ from "lodash";

const SettingsComponent = () => {
  const [currentColumn, setCurrentColumn] = useState(1);
  const [column1List, setColumn1List] = useState<any>(SettingsMap.ADMIN.setting);
  const [column2List, setColumn2List] = useState<any>();
  const [column3List, setColumn3List] = useState<any>();

  const menuClickHandler = (item: MenuListItem, currentColumn: SettingColumns, initialData: any = null) => {
    // Getting the current list based on the selection made in menuList
    let currentMenuSetting;
    if (currentColumn === SettingColumns.COLUMN1) {
      currentMenuSetting = {
        ...column1List,
      };
    } else if (currentColumn === SettingColumns.COLUMN2) {
      currentMenuSetting = {
        ...column2List,
      };
    }

    // loop over the current column list and make the clicked menu the selected one
    currentMenuSetting = {
      ...currentMenuSetting,
      data: {
        ...currentMenuSetting.data,
        items: currentMenuSetting.data.items.map((menuitem: any) => {
          return {
            ...menuitem,
            isSelected: menuitem.key === item.key,
          }
        }),
      }
    }

    // Update the same row menu list
    if (currentColumn === SettingColumns.COLUMN1) {
      setColumn1List(currentMenuSetting);
      setColumn2List(item.subSetting);
      setCurrentColumn(2);
    } else if (currentColumn === SettingColumns.COLUMN2) {
      setColumn2List(currentMenuSetting);
      setColumn3List({
        ...item.subSetting,
        data: _.isEmpty(initialData) ? item.subSetting.data : initialData,
      });
      setCurrentColumn(3);
    }
  }

  const columnLastStepHandler = (payload: any) => {
    let prevCol: SettingColumns = SettingColumns.COLUMN2
    if (currentColumn === 3) {
      prevCol = SettingColumns.COLUMN2;
      setCurrentColumn(2);
    } else if (currentColumn === 2) {
      prevCol = SettingColumns.COLUMN1;
      setCurrentColumn(2);
    }
    if (payload) {
      menuClickHandler(payload.nextSetting, prevCol, payload.initialData);
    }
  }

  const SettingColumnNode = ({ id, setting }: { id: SettingColumns; setting: ISetting}) => {
    return (
        <div id={id}>
          {
            setting.type === 'MENU'
                ? <MenuList {...setting.data} menuClickHandler={menuClickHandler} />
                : <setting.node {...setting.data} changeNavigation={columnLastStepHandler}/>
          }
        </div>
    )
  }

  return (
    <Layout pageHeading={"Settings page"} topRightChildElement={CloseSessionButtonComponent}>
      <div className={"setting-layout"}>
        {currentColumn && column1List && <SettingColumnNode id={SettingColumns.COLUMN1} setting={column1List} />}
        {currentColumn > 1 && column2List && <SettingColumnNode id={SettingColumns.COLUMN2} setting={column2List} />}
        {currentColumn > 2 && column3List && <SettingColumnNode id={SettingColumns.COLUMN3} setting={column3List} />}
      </div>
    </Layout>
  );
};

export default withRouter(SettingsComponent);
