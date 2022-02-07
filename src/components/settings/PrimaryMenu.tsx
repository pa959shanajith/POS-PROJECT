import React, { useState } from "react";
import "../../assets/scss/components/primaryMenu.scss";
import SubItemsMenu from "./SubItemsMenu";

const PrimaryMenu = (props: { data: any; })=>{
  const [id,selectedId] = useState(null);
  const [menu,showMenu] = useState(false);
  const [subItemsValue,changeSubItemsValue] = useState(null);
  const menuData = props.data;

  const renderMenuItems = () => {
    let menuItems: JSX.Element[] = [];
    menuData.map((item: { key: string | number; subItems: any; value: React.ReactNode; }, index: any) => {
      let changeHandler = ()=>{
        selectedId(item.key);
        showMenu(false);
        if (item.subItems) {
          changeSubItemsValue(item.subItems);
          showMenu(true);
        }
      };
      let pmMenuClsString = "pm-menu menu-items";
      if(index === id){
        pmMenuClsString = "pm-menu menu-items-selected";
      }
      menuItems.push(
        <div onClick={changeHandler} className={pmMenuClsString} key={item.key}>
          <span>{item.value}</span>
        </div>
      );
    });
    return(menuItems);
  };
  return(
    <div style={{ display: "flex" }}>
      <div className="pm-main-container">
        {renderMenuItems()}
      </div>
      {menu ? (<SubItemsMenu data={subItemsValue}/>) : null}
    </div>
  );
};
PrimaryMenu.propTypes = {
  data: []
};
export default PrimaryMenu;
