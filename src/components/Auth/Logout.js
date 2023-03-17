import React from "react";
import { useAuth0 } from '@auth0/auth0-react';
import { createRoutesFromElements } from "react-router-dom";

export default function Logout(){
    const { isAuthenticated, logout, user } = useAuth0();

    return isAuthenticated && (
        <div className="logout-div" style={{ display: 'flex', flexFlow: 'column', flexWrap: 'nowrap' }}>
            <img className="profile-picture" src={user.picture} style={{height: 75, borderRadius: 50, border: 10}}></img>
            <button onClick={() => {
                    logout({ 
                        logoutParams: {
                    returnTo: window.location.origin
                    }
                });
            }
            }>Logout</button>
        </div>
    );
}