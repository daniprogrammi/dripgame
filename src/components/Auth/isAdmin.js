import React from "react";
import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import checkUserIsAdmin from "../../services/checkUserIsAdmin";

// Needs to be a provider/hook?
export default function IsAdmin(){
    const { user } = useAuth0();
    const [ userIsAdmin, setUserIsAdmin ] = useState(false);
    
    setUserIsAdmin(checkUserIsAdmin(user));    
}