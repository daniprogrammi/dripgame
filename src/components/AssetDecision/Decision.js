import { useEffect, useRef, useState } from "react";
import approveAsset from "../../services/approveAsset";
import rejectAsset from "../../services/rejectAsset";
import fetchAllAssets from "../../services/fetchAllAssets";
import fetchReportedAssets from "../../services/fetchReportedAssets";
import UploadForm from "../UploadForm/UploadForm";
import Gallery from "../Gallery/Gallery";
import fetchAssetByUrl from "../../services/fetchAssetByUrl";
import fetchAssetById from "../../services/fetchAssetById";


export default function Decision({assetState='undecided'}){
    // todo: user has to be authd, has to be on whitelist to successfully request unapproved assets
    const [assetsToReturn, setAssetsToReturn] = useState([]);
    const inFocusAsset = useRef(null); //Maybe even useContext???? -- will give us the assetObj and not the element
    
    const [assetExtra, setAssetExtra] = useState({});
    const [inputfileObj, setInputFileObj] = useState({});
    const [modelID, setModelID] = useState(null);

    const categoryOptions = ['top', 'bottom', 'suit', 'shoe', 'accessories', 'hair', 'face', 'model', 'backdrop']; // Use fetchAllCategories instead
    
    const acceptImageCallback = (id) => {
        let focusedAsset = document.getElementsByClassName('focused-img')[0].firstChild;  // <-- proxy for using useRef rn inFocusAsset.current;
        id = focusedAsset.id;
        (async () => {
            console.log(id);
            let updatedAsset = await approveAsset(id);            
        })();
        window.location.reload(false);
    };

    const rejectImageCallback = (id) => {
        let focusedAsset = document.getElementsByClassName('focused-img')[0].firstChild;  // <-- proxy for using useRef rn inFocusAsset.current;
        id = focusedAsset.id; //let focusedAsset = document.getElementsByClassName('focused-img')[0];  // <-- proxy for using useRef rn inFocusAsset.current;
        console.log("Rejecting " + id);
        (async () => {
            let updatedAsset = await rejectAsset(id);            
        })();
        window.location.reload(false);
    }


    // useEffect(() => {
    //     (async () => {
    //         let assets;
    //         if (assetState === 'undecided') {
    //             assets = await fetchAllAssets();
    //         }
    //         else if (assetState === 'reported') {
    //            assets = await fetchReportedAssets();
    //            let reportedAssets = [];
    //            for (let reportedAsset of assets){
    //                 let asset = await fetchAssetById(reportedAsset.assetId);
    //                 reportedAsset = { ...asset , ...reportedAsset };
    //                 reportedAssets.push(reportedAsset);
    //            }
    //            assets = reportedAssets;
    //         }
    //         setAssetsToReturn(assets);
    //         console.log(assets);
    //         }
    //      )();
    //  }, []);

    return (
        <div className="decision-div">
            {/* {assetsToReturn && 
            assetsToReturn.map(assetObj => {
                   return (
                   <div className="decision-img focused-img">
                   <img id={assetObj._id}
                    src={assetObj.imageURL} 
                    alt={assetObj.briefDescription ? assetObj.briefDescription : "Sorry, no alt text for this asset yet, will update soon"}
                    width={500}
                    height={500}
                     />
                     {/* Maybe include form to potentially update asset info 
                     {assetObj.icon ? 
                        (
                            <div className="icon-img">
                                <img src={assetObj.imageURL} alt={assetObj.briefDescription ? `icon for ${assetObj.briefDescription}` : "Sorry, no alt text yet"} />
                            </div>
                        ) :

                        (
                            <div className="icon-img-placeholder">
                            </div>
                        )
                    }
                     </div>);
                    })} */}
            <button className="accept-img-btn btn btn-primary" onClick={()=>console.log("Accept")}>Accept</button>
            <button className="reject-img-btn btn btn-primary" onClick={()=>console.log("Reject")}>Reject</button>
            {/* Get target id by what image is currently active in the Gallery  */}
            <Gallery assetStateToDisplay={assetState}></Gallery>
            <UploadForm></UploadForm>
        </div>
    );
}