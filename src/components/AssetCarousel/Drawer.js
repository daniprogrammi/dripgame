import React from "react";
import { useState } from "react";
import { BsFillArrowRightCircleFill } from 'react-icons/bs';
import './Drawer.css';

export default function Drawer({children}) {
    const [drawerOpen, setDrawerOpen] = useState(false);

    const toggleDrawer = () => { 
        setDrawerOpen(!drawerOpen);
        console.log(`DrawerOpen: ${drawerOpen}`);
    };

    return (
        <div className="asset-drawer">
            <BsFillArrowRightCircleFill onClick={toggleDrawer}>
            </BsFillArrowRightCircleFill>
            {drawerOpen ? children : <p>Assets</p>}
        </div>
    );
}