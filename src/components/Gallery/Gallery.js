import { useEffect, useState} from "react";
import GalleryImage from "./GalleryImage";
import ImageGallery from 'react-image-gallery';
import fetchAllAssets from "../../services/fetchAllAssets";
import './Gallery.scss';
import Report from "../Report/Report";
import { Button } from "@mantine/core";
import { useAuth0 } from '@auth0/auth0-react';

function fetchAssets() {
    return fetch('http://localhost:3005/assets', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(data => data.json());
}


export default function Gallery() {
    const { user, isAuthenticated } = useAuth0();
    let [assets, setassetState] = useState([]);
    let [currentSlideIndex, setCurrSlideIndex] = useState(0);
    let [reportImageId, setReportImageId] = useState(null);
    const [visible, setVisible] = useState(false);

    let properties = {
      showIndex: false,
      showBullets: true,
      infinite: true,
      showThumbnails: true,
      showFullscreenButton: true,
      showGalleryFullscreenButton: true,
      showPlayButton: true,
      showGalleryPlayButton: true,
      showNav: true,
      isRTL: false,
      slideDuration: 450,
      slideInterval: 2000,
      slideOnThumbnailOver: false,
      thumbnailPosition: 'bottom',
      showVideo: {},
      useWindowKeyDown: true,
    };


    useEffect(()=> {
        (async () => {
            let data = await fetchAllAssets(true);
            let cleanedData = 
            data.filter(assetObj => assetObj.approved) // Data should be approved to be displayed
                .map((obj) => {
                    return {
                        id: window.crypto.randomUUID(),
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

    const setFlagPressed = () => {
        console.log(currentSlideIndex);
        const currentAsset = assets[currentSlideIndex];
        setReportImageId(currentAsset.id); // Context
        // set this instead currentAsset.imageURL
        setVisible(true);
    }


    const getAssetImages = () => {
        let returnArray = [];
        if (assets && assets.length > 0){
            returnArray = assets.map((assetObj) => {
                return ( 
                <GalleryImage imgSource={assetObj.imageURL} 
                    imgWidth={assetObj.width ? assetObj.width : 500} 
                    imgHeight={assetObj.height ? assetObj.height: 500}>
                </GalleryImage>
                );
            });
        }
        return returnArray;
}

    const onSlideChange = (currentIndex) => {
        setVisible(false);
        // TODO need a useCallback to clear form
        setCurrSlideIndex(currentIndex);
    }
// NEED A STYLE GUIDELINE ASAP because scaling will look horendous
    return (
        <div className="gallery">
            <div className="gallery-images">
                {/* TODO: FIX key error */}
                <ImageGallery items={assets}
                    infinite={properties.infinite}
                    showBullets={properties.showBullets}
                    showFullscreenButton={properties.showFullscreenButton && properties.showGalleryFullscreenButton}
                    showPlayButton={properties.showPlayButton && properties.showGalleryPlayButton}
                    showThumbnails={properties.showThumbnails}
                    showIndex={properties.showIndex}
                    showNav={properties.showNav}
                    isRTL={properties.isRTL}
                    thumbnailPosition={properties.thumbnailPosition}
                    slideDuration={parseInt(properties.slideDuration)}
                    slideInterval={parseInt(properties.slideInterval)}
                    slideOnThumbnailOver={properties.slideOnThumbnailOver}
                    additionalClass="app-image-gallery"
                    useWindowKeyDown={properties.useWindowKeyDown}
                    onSlide={(currentIndex)=>{onSlideChange(currentIndex)}}/>
            </div>
                {user && isAuthenticated ?
                    (
                    <div className="report-image-div">
                    <Button color="red" onClick={(event) => {setFlagPressed()}}> Report Image </Button>
                    <div className="report-image-form" style={visible ? {} : {'visibility':'hidden'}}>
                        <Report imageId={reportImageId} user={user.nickname} style={{}}></Report>
                    </div>
                    </div>
                    )
                    :
                    (
                        <div className="report-image-div">
                            <p>Please login through twitch to report images</p>
                        </div>
                    )}
            </div>
    );

}