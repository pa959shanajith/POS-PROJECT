import React, { useState } from "react";
import MenuContent from "./MenuContent";

const SubItemsMenu = (props)=>{
  const [id,selectedId] = useState(null);
  const [content,showContent] = useState(false);
  const [contentData,changeContentData] = useState(null);
  const subMenuData = props.data;
  const renderSubMenuItems = ()=>{
    let subItemsMenu = [];
    subMenuData.map((item,index)=>{
      let changeHandler = ()=>{
        selectedId(item.key);
        showContent(false);
        if(item.value.content){
          changeContentData(item.value.content);
          showContent(true);
        }
      };
      let pmMenuClsString = "pm-menu menu-items";
      if(index === id){
        pmMenuClsString = "pm-menu menu-items-selected";
      }
      subItemsMenu.push(
        <div onClick={changeHandler} className={pmMenuClsString} key={item.key}>
          <span>{item.value.text}</span>
        </div>
      );
    });
    return(subItemsMenu);
  };
  return (
    <div style={{ display: "flex" }}>
      <div className='pm-main-container'>
        {renderSubMenuItems()}
      </div>
      {content ? (<MenuContent data={contentData}/>) : null}
    </div>);
};
SubItemsMenu.propTypes = {
  data: []
};
export default SubItemsMenu;
