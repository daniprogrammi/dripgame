import { Upload } from 'upload-js';
import { useState } from 'react';
import { useEffect } from 'react';

// Doesn't like either import method???????????????????????????????????
//const { createAsset, getAssetByFilename } = require('../../data/assets');
//import { createAsset, getAssetByFilename } from '../../data/assets';


const upload = new Upload({ apiKey: "free" });

export default function UploadFile() {

    const [progress, setProgress] = useState(null);
    const [fileUrl, setFileUrl] = useState(null);    
    const [error, setError] = useState(null);

    const [assetCategory, setAssetCategory] = useState(null);

    const [assetLabel, setAssetLabel] = useState(null);
    const [contributorName, setContributorName] = useState(null);

    const submitUploadForm = (e) => {
        e.preventDefault();

        console.log(assetCategory);
        console.log(assetLabel);
        console.log(contributorName);
        // let filename = await getAssetByFilename(fileUrl);
        // if (!!fileUrl) { //if filename is not already stored
            // await createAsset(assetCategory, assetLabel, fileUrl, contributorName);
        // }       
    }
   
    if (fileUrl !== null){
        return (
        <div className='contribution-form-div'>
        <h3>Give more info about this upload:</h3>
        <form id='contributionForm' onSubmit={e => submitUploadForm(e)}>
            <div className="contribution-form-asset-categories">
            <input type='radio' id="asset-category-tops" name="asset-category" value={assetCategory} onChange={e => setAssetCategory("top")}></input>
            <label htmlFor="asset-category-tops">Tops</label>
            
            <input type='radio' id='asset-category-suit' name="asset-category" value={assetCategory} onChange={e => setAssetCategory("bottom")}></input> 
            <label htmlFor="asset-category-bottom">Bottoms</label>
            
            <input type='radio' id='asset-category-suit' name="asset-category" value={assetCategory} onChange={e => setAssetCategory("suit")}></input> 
            <label htmlFor="asset-category-suit">Suit</label>
            
            <input type='radio' id='asset-category-shoes' name="asset-category" value={assetCategory} onChange={e => setAssetCategory("shoe")}></input> 
            <label htmlFor="asset-category-shoes">Shoes</label>
            
            <input type='radio' id='asset-category-model' name="asset-category" value={assetCategory} onChange={e => setAssetCategory("model")}></input> 
            <label htmlFor="asset-category-model">Model</label>
            
            <input type='radio' id='asset-category-hair' name="asset-category" value={assetCategory} onChange={e => setAssetCategory("hair")}></input> 
            <label htmlFor="asset-category-Hair">Hair</label>
            
            <input type='radio' id='asset-category-face'  name="asset-category" value={assetCategory} onChange={e => setAssetCategory("face")}></input>
            <label htmlFor="asset-category-face">Face</label>
            
            <input type='radio' id='asset-catgory-backdrop' name="asset-category" value={assetCategory} onChange={e => setAssetCategory("backdrop")}></input>
            <label htmlFor="asset-category-backdrop">Backdrop</label>
            </div>
            <div>
                <label htmlFor="asset-label">Name for this asset:</label>
                <input type="text" value={assetLabel} id="asset-label" onChange={e => setAssetLabel(e.target.value)} />
                <label htmlFor="asset-contributor">Contributor name:</label>
                <input type="text" value={contributorName} id="asset-contributor" onChange={e => setContributorName(e.target.value)}/>
                {/* Eventually will include socials as well */}
                {/* <input type="text" name="asset-contributor-other-things-idk-i-forget" id="" /> */}
                </div>
            
            <input type="submit" value="Submit"/>
        </form>
        </div>
        )
    }
    
    if (error !== null) return error.message;
    if (progress !== null ) return <>File uploading... {progress}%</>;

    return (
        <>
        {/* <input type="file"></input> */}
        <input type="file" 
            onChange={upload.createFileInputHandler({
                onBegin: ({cancel}) => setProgress(0),
                onProgress: ({ progress }) => setProgress(progress),
                onUploaded: ({ fileUrl }) => setFileUrl(fileUrl),
                onError: (error) => setError(error)
            })} />
        </>
    )
}