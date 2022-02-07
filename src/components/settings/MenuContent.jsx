import React from "react";
import Logger from "../../lib/logger";

const MenuContent = (props)=>{
  Logger.log(props.data);
  return(
    <div className='pm-main-container'>
      <span className='pm-menu'>{props.data}</span>
    </div>
  );
};
MenuContent.propTypes = {
  data: []
};
export default MenuContent;
