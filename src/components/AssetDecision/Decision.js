import { useEffect, useRef, useState } from "react";
import approveAsset from "../../services/approveAsset";
import rejectAsset from "../../services/rejectAsset";
import fetchAllAssets from "../../services/fetchAllAssets";
import UploadForm from "../UploadForm/UploadForm";


export default function Decision(){
    // todo: user has to be authd, has to be on whitelist to successfully request unapproved assets
    const [undecidedAssets, setUndecidedAssets] = useState([]);
    const inFocusAsset = useRef(null); //Maybe even useContext???? -- will give us the assetObj and not the element
    
    const [assetExtra, setAssetExtra] = useState({});
    const [inputfileObj, setInputFileObj] = useState({});
    const [modelID, setModelID] = useState(null);

    const categoryOptions = ['top', 'bottom', 'suit', 'shoe', 'accessories', 'hair', 'face', 'model', 'backdrop'];
    
    const acceptImageCallback = (id) => {
        let focusedAsset = document.getElementsByClassName('focused-img')[0].firstChild;  // <-- proxy for using useRef rn inFocusAsset.current;
        id = focusedAsset.id;
        (async () => {
            console.log(id);
            let updatedAsset = await approveAsset(id);            
        })();
    };

    const rejectImageCallback = (id) => {
        let focusedAsset = document.getElementsByClassName('focused-img')[0].firstChild;  // <-- proxy for using useRef rn inFocusAsset.current;
        id = focusedAsset.id; //let focusedAsset = document.getElementsByClassName('focused-img')[0];  // <-- proxy for using useRef rn inFocusAsset.current;
        console.log("Rejecting " + id);
        (async () => {
            let updatedAsset = await rejectAsset(id);            
        })();
    }


    useEffect(() => {
        (async () => {
            let assets = await fetchAllAssets();
            setUndecidedAssets(assets);
            console.log(assets);
            }
         )();
     }, []);

    return (
        <div className="decision-div">
            {undecidedAssets && 
            undecidedAssets.map(assetObj => {
                   return (
                   <div className="decision-img focused-img">
                   <img id={assetObj._id}
                    src={assetObj.file} 
                    alt={assetObj.briefDescription ? assetObj.briefDescription : "Sorry, no alt text for this asset yet, will update soon"}
                     />
                     {/* Maybe include form to potentially update asset info */}
                     {assetObj.icon ? 
                        (
                            <div className="icon-img">
                                <img src={assetObj.icon} alt={assetObj.briefDescription ? `icon for ${assetObj.briefDescription}` : "Sorry, no alt text yet"} />
                            </div>
                        ) :

                        (
                            <div className="icon-img-placeholder">
                            </div>
                        )
                    }
                     </div>);
                    })}
            <button className="accept-img-btn btn btn-primary" onClick={(event) => acceptImageCallback(event.target.id)}>Accept</button>
            <button className="reject-img-btn btn btn-primary" onClick={(event) => rejectImageCallback(event.target.id)}>Reject</button>
           <UploadForm></UploadForm>
        </div>
    );
}