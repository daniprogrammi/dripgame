import { Upload } from 'upload-js';
import { useState } from 'react';
import { useEffect } from 'react';
import createContributor  from '../../services/createContributor';
import  fetchContributorByUsername  from '../../services/fetchContributorByUsername';
import fetchAssetByUrl from '../../services/fetchAssetByUrl';

import uploadAsset  from '../../services/uploadAsset';
import UploadForm from '../UploadForm/UploadForm';


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
            "twitchUsername": username,
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
    const categoryOptions = ['tops', 'bottoms', 'sets', 'shoes', 'accessories', 'hair', 'face', 'poses', 'backdrop'];
    if (fileUrl !== null){

        return (
        <div className='contribution-form-div'>
            <div className="row">
                <h4>Hey {username}, give us more info about this upload:</h4>
            </div>
            <form id='contributionForm' onSubmit={e => submitUploadForm(e)}>
                <div className="row">
                    <div className="contribution-form-asset-categories">
                        <label htmlFor="asset-category">
                            Asset category:
                        </label>

                        <select id='asset-category' name='asset-category' value={inputfileObj.assetCategory} onChange={e => setInputFileObj({...inputfileObj, 'assetCategory': e.target.value})}>
                            {categoryOptions.map(category => {
                                return (
                                    <option value={`${category}`}>{category[0].toUpperCase() + category.slice(1)}</option>
                                );
                            })}
                        </select>
                    </div>
                </div>

                <div className='row'>
                    <label htmlFor="asset-label">Name for this asset:</label>
                    <input type="text" value={inputfileObj.assetLabel} id="asset-label" onChange={e => setInputFileObj({...inputfileObj, 'assetLabel': `${e.target.value}`})} />
                    {/* Eventually will include socials as well */}
                {/* <input type="text" name="asset-contributor-other-things-idk-i-forget" id="" /> */}
                </div>

            <div className='row'>
                <p>Submit any extra info about this asset:</p>
                <textarea name="assetExtra" id="assetExtra-area" cols="30" rows="10"  placeholder='example(brand: gucci, material: silk)'
                     onChange={e => setAssetExtra({...assetExtra, ...parseAssetExtra(e.target.value)})}>
                </textarea>
            </div>
            
            <input type="submit" value="Submit"/>
        </form>
        </div>
        );
    }
    
    console.log(`This user: ` + username);
    if (error !== null) return error.message;
    if (progress !== null ) return <>File uploading... {progress}%</>;

    return (
        <div className='uploadFile'>
        {/* <input type="file"></input> */}
        <label for="artUpload" class="form-label">Add artwork here</label>
        <input 
            className='customFileInput form-control-lg'
            id='artUpload'
            type="file" 
            onChange={upload.createFileInputHandler({
                onBegin: ({cancel}) => setProgress(0),
                onProgress: ({ progress }) => setProgress(progress),
                onUploaded: ({ fileUrl }) => setFileUrl(fileUrl),
                onError: (error) => setError(error)
            })} />
        </div>
    )
}