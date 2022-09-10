import { useEffect, useState} from "react";
import Image from "./Image";
import fetchAllAssets from "../../services/fetchAllAssets";

function fetchAssets() {
    return fetch('http://localhost:3005/assets', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(data => data.json());
}


export default function Gallery() {
    let [assets, setassetState] = useState([]);

    useEffect(()=> {
        (async () => {
            let data = await fetchAllAssets(true);
            data.filter(assetObj => assetObj.approved); // Data should be approved to be displayed
            // TODO: sort by uploadDate if present
            setassetState(data);
            console.log(data[0]['file']);
        }
        )();
    }, []);


    // NEED A STYLE GUIDELINE ASAP because scaling will look horendous
    return (
        <div className="gallery-images">
            { assets && assets.map((assetObj) => {
                return ( 
                <div className="single-image">
                <Image imgSource={assetObj.file} 
                       imgWidth={assetObj.width ? assetObj.width : 500} 
                       imgHeight={assetObj.height ? assetObj.height: 500}>
                </Image>
                <div className="single-image-info">
                    <p> {assetObj['label']} by {assetObj['contributorUsername']} </p>
                </div>
                </div>
                );
            })}
        </div>
    );

}