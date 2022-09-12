import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

export default function Auth(){
    const { loginWithRedirect } = useAuth0();
    
    return (
        <div>
            <p>Please authenticate with Twitch to upload a file</p>
            <button className="btn btn-primary btn-block" onClick={() => loginWithRedirect()}>Log in</button>
        </div>
    ); // Authenticate -> save token to document.cookie? -> set expire to 1/2 hours
}