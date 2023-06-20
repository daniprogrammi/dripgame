import { useState } from "react";
import { Button } from '@mantine/core';
import Decision from "../../components/AssetDecision/Decision";


export default function Admin() {
    let [assetStateToSearch, setAssetStateToSearch] = useState("undecided")
    let [clicked, setClicked] = useState(false);   

    return (
    <div>
        <p>Admins go here</p>
        <button onClick={()=>{
                        setAssetStateToSearch("undecided");
                        setClicked(true);
                        }}>
            New Submissions
        </button>
        <button onClick={
                    ()=>{setAssetStateToSearch("reported");
                    setClicked(true);
                    }}>
            Reported Images
        </button>
        {clicked &&
         <Decision assetState={assetStateToSearch}></Decision>}
    </div>
    );
}