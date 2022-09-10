import { Upload } from 'upload-js';
import { useState } from 'react';
import { useEffect } from 'react';
import createContributor  from '../../services/createContributor';
import  fetchContributorByUsername  from '../../services/fetchContributorByUsername';
import fetchAssetByUrl from '../../services/fetchAssetByUrl';

import { uploadAsset } from '../../services/uploadAsset'


const upload = new Upload({ apiKey: "free" });

export default function UploadFile({username}) {

    const [progress, setProgress] = useState(null);
    const [fileUrl, setFileUrl] = useState(null);    
    const [error, setError] = useState(null);

    const [assetExtra, setAssetExtra] = useState({});
    const [inputfileObj, setInputFileObj] = useState({});
    const [modelID, setModelID] = useState(null);
// } -- react wants this to be controlled by state?
    const parseAssetExtra = (value) => {
        if (!value) {
            return {};
        }

        try {
            let pairs = value.trim().split(',');
            let valueObj = {};

            for (let pair of pairs) {
                let [key, val] = pair.split(':');
                valueObj[key.trim()] = val.trim();
            }
            return valueObj;
        }
        catch(e){
            //TODO: Return error
            return {};
        }
    }

    const submitUploadForm = (e) => {
        e.preventDefault();

        console.log(inputfileObj.assetCategory);
        console.log(inputfileObj.assetLabel);
        console.log(inputfileObj.twitchUsername);
        
        let storedFileUrl = fetchAssetByUrl(fileUrl); 
        if (storedFileUrl) {
            return (
                <div className='upload-error'>
                    <p>This file already uploaded</p>
                </div>
            );
        }
        else {
            let fileObj = uploadAsset({
            "modelID": modelID,
            "category": inputfileObj.assetCategory,
            "label": inputfileObj.assetLabel,
            "file": fileUrl,
            "twitchUsername": inputfileObj.contributorName, // TODO: username will come from auth
            "approved": false,
            "published": false,
            "assetExtra" : { 
                            "color": inputfileObj.color ? inputfileObj.color : null,
                            "icon": inputfileObj.icon ? inputfileObj.icon : null, // Either scale down assetFile or ask users to submit a 50x50 file
                            "briefDescription": inputfileObj.briefDescription ? inputfileObj.briefDescription : null, // Mostly for use in alt text for images
                            ...assetExtra
                            }
            });
        }
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
            <input type='radio' id="asset-category-tops" name="asset-category" value={inputfileObj.assetCategory} onChange={e => setInputFileObj({...inputfileObj, 'assetCategory': "top"})}></input>
            <label htmlFor="asset-category-tops">Tops</label>
            
            <input type='radio' id='asset-category-suit' name="asset-category" value={inputfileObj.assetCategory} onChange={e => setInputFileObj({...inputfileObj, 'assetCategory': "bottom"})}></input> 
            <label htmlFor="asset-category-bottom">Bottoms</label>
            
            <input type='radio' id='asset-category-suit' name="asset-category" value={inputfileObj.assetCategory} onChange={e => setInputFileObj({...inputfileObj, 'assetCategory': "suit"})}></input> 
            <label htmlFor="asset-category-suit">Suit</label>
            
            <input type='radio' id='asset-category-shoes' name="asset-category" value={inputfileObj.assetCategory} onChange={e => setInputFileObj({...inputfileObj, 'assetCategory': "shoe"})}></input> 
            <label htmlFor="asset-category-shoes">Shoes</label>
            
            <input type='radio' id='asset-category-model' name="asset-category" value={inputfileObj.assetCategory} onChange={e => setInputFileObj({...inputfileObj, 'assetCategory': "model"})}></input> 
            <label htmlFor="asset-category-model">Model</label>
            
            <input type='radio' id='asset-category-hair' name="asset-category" value={inputfileObj.assetCategory} onChange={e => setInputFileObj({...inputfileObj, 'assetCategory': "hair"})}></input> 
            <label htmlFor="asset-category-Hair">Hair</label>
            
            <input type='radio' id='asset-category-face'  name="asset-category" value={inputfileObj.assetCategory} onChange={e => setInputFileObj({...inputfileObj, 'assetCategory': "face"})}></input>
            <label htmlFor="asset-category-face">Face</label>
            
            <input type='radio' id='asset-catgory-backdrop' name="asset-category" value={inputfileObj.assetCategory} onChange={e => setInputFileObj({...inputfileObj, 'assetCategory': "backdrop"})}></input>
            <label htmlFor="asset-category-backdrop">Backdrop</label>
            </div>
            <div>
                <label htmlFor="asset-label">Name for this asset:</label>
                <input type="text" value={inputfileObj.assetLabel} id="asset-label" onChange={e => setInputFileObj({...inputfileObj, 'assetLabel': `${e.target.value}`})} />
                <label htmlFor="asset-contributor">TwitchUsername:</label>
                {/* Contributor name should be taken directly from the authenticated user */}
                <input type="text" value={username} id="asset-contributor"/>
                {/* Eventually will include socials as well */}
                {/* <input type="text" name="asset-contributor-other-things-idk-i-forget" id="" /> */}
                </div>

            <div>
                <p>Submit any extra info about this asset:</p>
                <textarea name="assetExtra" id="assetExtra-area" cols="30" rows="10"  placeholder='example(brand: gucci, material: silk)'
                     onChange={e => setAssetExtra({...assetExtra, ...parseAssetExtra(e.target.value)})}>
                </textarea>
            </div>

            
            <input type="submit" value="Submit"/>
        </form>
        </div>
        )
    }
    
    console.log(`This user: ` + username);
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