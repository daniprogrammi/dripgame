import { useEffect, useState} from "react";
import GalleryImage from "./GalleryImage";
import ImageGallery from 'react-image-gallery';
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
            let cleanedData = 
            data.filter(assetObj => assetObj.approved) // Data should be approved to be displayed
                .map((obj) => {
                    console.log(obj.imageURL)
                    return {
                        original: obj.imageURL, 
                        thumbnail: obj.imageURL,
                        thumbnailHeight: 50,
                        thumbnailWidth: 50,
                        originalHeight: obj.height ? obj.height/2 : 500,
                        originalWidth: obj.width ? obj.width/2 : 500
                }
                });

            setassetState(cleanedData);
            console.log(data[0]['file']);
        }
        )();
    }, []);


    // NEED A STYLE GUIDELINE ASAP because scaling will look horendous
    return (
        <div className="gallery-images">
            {/* TODO: FIX key error */}
            <ImageGallery items={assets}/>
            { assets && assets.map((assetObj) => {
                return ( 
                <div className="single-image">
                <GalleryImage imgSource={assetObj.imageURL} 
                       imgWidth={assetObj.width ? assetObj.width : 500} 
                       imgHeight={assetObj.height ? assetObj.height: 500}>
                </GalleryImage>
                <div className="single-image-info">
                    <p> {assetObj['label']} by {assetObj['contributorUsername']} </p>
                </div>
                </div>
                );
            })}
        </div>
    );

}