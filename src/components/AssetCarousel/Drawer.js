import React from "react";
import { useState } from "react";
import './Drawer.scss';

export default function Drawer({children}) {
    const [drawerOpen, setDrawerOpen] = useState(false);

    const toggleDrawer = () => { 
        setDrawerOpen(!drawerOpen);
    };

    return (
        <div className="assetDrawer">
            {/* <BsFillArrowRightCircleFill className="assetDrawerIcon" onClick={toggleDrawer}>
            </BsFillArrowRightCircleFill> */}
            <button className={drawerOpen ? "btn drawerBtnOpen" : "btn drawerBtnClose"} onClick={toggleDrawer}>
                Assets</button>
            {drawerOpen ? children : <></>}
        </div>
    );
}