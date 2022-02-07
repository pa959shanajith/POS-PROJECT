import React from "react";
import "../../assets/scss/components/layout.scss";

const Layout = (props)=>{
  return(
    <div className='layout-container'>
      <div className="page-heading">
        <span>{props.pageHeading}</span>
      </div>
      <div className={`layout-child-container ${props.isCentered && 'j-cont-cen'}`}>
        {props.children}
      </div>
      {
          props.topRightChildElement ? (
             <div className={'top-right-section'}>
                 {props.topRightChildElement()}
             </div>
          ) : null
      }
    </div>
  );
};
export default Layout;
