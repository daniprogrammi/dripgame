import React from "react";
import { useState } from "react";
import './Drawer.scss';

export default function Drawer({categoryName, children}) {
    const [drawerOpen, setDrawerOpen] = useState(false);

    const toggleDrawer = () => { 
        setDrawerOpen(!drawerOpen);
    };

    return (
        <div className={`assetDrawer assetDrawer-${categoryName}`}>
            {/* <BsFillArrowRightCircleFill className="assetDrawerIcon" onClick={toggleDrawer}>
            </BsFillArrowRightCircleFill> */}
            <button className={drawerOpen ? "btn drawerBtnOpen" : "btn drawerBtnClose"} onClick={toggleDrawer}>
                {categoryName}</button>
            {drawerOpen ? children : <></>}
        </div>
    );
}