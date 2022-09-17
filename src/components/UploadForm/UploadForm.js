import { useState, useEffect, useRef } from 'react';
import { Upload } from 'upload-js';

// Service calls
import createModel from '../../services/createModel';
import createContributor from '../../services/createContributor';
import fetchModels from '../../services/fetchModels';
import fetchContributorByUsername from '../../services/fetchContributorByUsername';
import fetchModelByUsername from '../../services/fetchModelByUsername';
import fetchAssetByUrl from '../../services/fetchAssetByUrl';
import uploadAsset from '../../services/uploadAsset';

import { useAuth0 } from '@auth0/auth0-react';

const upload = new Upload({ apiKey: "free" });


export default function UploadForm({username, fileUrl}){
    const [assetExtra, setAssetExtra] = useState({});
    const [inputfileObj, setInputFileObj] = useState({});
    const [modelID, setModelID] = useState(null);

    const [iconFileUrl, setIconFileUrl] = useState(null);    
    const [progress, setProgress] = useState(null); 
    const [error, setError] = useState(null);

    const [modelMissingError, setModelMissingError] = useState(false);

    const [modelOptions, setModelOptions] = useState([]);

    const { user } = useAuth0();

    const categoryOptions = ['tops', 'bottoms', 'sets', 'shoes', 'accessories', 'hair', 'face', 'model', 'backdrop'];
    const colors = ['white', 'yellow', 'blue', 'red', 'green', 'black', 'brown', 'grey', 'purple', 'orange', 'pink', 'multicolor']

    // 
    useEffect(() => {
        (async () => {
            let modelOptions = await fetchModels();
            setModelOptions(modelOptions);
        })();
    }, []);

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
        
        if (!inputfileObj.modelUsername) {
            setModelMissingError(true);
        }
        let storedFileUrl = fetchAssetByUrl(fileUrl); 
        if (storedFileUrl) {
            return (
                <div className='upload-error'>
                    <p>This file already uploaded</p>
                </div>
            );
        }
        else {

            (async() => {
                let modelId;
                let modelObj = await fetchModelByUsername(inputfileObj.modelUsername);
                if (!modelObj) {
                    modelObj = await createModel(inputfileObj.modelUsername);
                }
                modelId = modelObj._id;
                setModelID(modelId);
            })();

            let fileObj = uploadAsset({
            "modelID": modelID,
            "category": inputfileObj.assetCategory,
            "label": inputfileObj.assetLabel,
            "file": fileUrl,
            "twitchUsername": user.nickname,
            "owner": inputfileObj.owner,
            "assetExtra" : { 
                            "color": inputfileObj.color ? inputfileObj.color : null,
                            "icon": iconFileUrl ? iconFileUrl : null, // Either scale down assetFile or ask users to submit a 50x50 file
                            "briefDescription": inputfileObj.briefDescription ? inputfileObj.briefDescription : null, // Mostly for use in alt text for images
                            ...assetExtra
                            }
            });

            (async() => {
                // Check that the contributor already exists if not create one here, can update later
                let contributor = await fetchContributorByUsername(user.nickname);
                if (!contributor) {
                    contributor = await createContributor({'twitchUsername': user.nickname});
                }

                let fileCreated = await uploadAsset(fileObj);
                if (fileCreated.assetInserted) {
                    console.log("Asset successfully created");
                }
            })();
        }
    }

    return (
            <div className='contribution-form'>
                <h3>Contribution Form:</h3>
            <form id='contribution-form' onSubmit={e => submitUploadForm(e)}>
                <div className={`asset-model-select ${modelMissingError ? 'asset-model-error error' : ''}`}>
                <label htmlFor='model-select-input'>Model's twitch username:</label>
                <input type="text" list="models" name="model-select-input" id="model-input" value={inputfileObj.modelUsername} 
                onChange={e => setInputFileObj({...inputfileObj, modelUsername: e.target.value ? e.target.value : ""})}/> 
                <datalist name="model-select" id="model-select-input">
                    {modelOptions.map(model => {
                        return (
                            <option value={`${model.twitchUsername}`}>{model[0].toUpperCase() + model.slice(1)}</option>
                        );
                    })}
                </datalist>
                {modelMissingError ? (<div className='modelMissingError'> <p>Must input model</p></div>) : (<></>)}
                </div>

                <div className="asset-owner-input">
                    <input type="radio" name="asset-owner-input" id="asset-owner-input-yes" value={inputfileObj.owner} onChange={e => setInputFileObj({...inputfileObj, owner: true})}/>
                    <label htmlFor="asset-owner-input-yes">Yes</label>
                    <input type="radio" name="asset-owner-input" id="asset-owner-input-no" value={inputfileObj.owner} onChange={e => setInputFileObj({...inputfileObj, owner: false})}/>
                    <label htmlFor="asset-owner-input-no">No</label>
                </div>

                <div className="asset-category-div">
                        <label htmlFor="asset-category">
                            Asset category:
                        </label>

                        <select id='asset-category-select' name='asset-category' value={inputfileObj.assetCategory} 
                                onChange={e => setInputFileObj({...inputfileObj, 'assetCategory': e.target.value})}>
                            {categoryOptions.map(category => {
                                return (
                                    <option value={`${category}`}>{category[0].toUpperCase() + category.slice(1)}</option>
                                );
                            })}
                        </select>
                </div> 
                
                <div className="asset-label-div">
                    <label htmlFor="asset-label">Name for this asset:</label>
                    <input type="text" value={inputfileObj.assetLabel} id="asset-label" onChange={e => setInputFileObj({...inputfileObj, 'assetLabel': `${e.target.value}`})} />
                </div>
                <div className="asset-brief-description">
                    <textarea name="asset-brief-description" id="asset-brief-description" cols="30" rows="10">
                    </textarea>
                </div>

                <div className="asset-icon-upload">
                    <input type="file" name="icon-upload" id="icon-upload"/>
                </div>

                <div className="asset-color-select">
                     <label htmlFor="asset-color-select">
                            Color:
                    </label>                   
                    <select name="asset-color-select" id="asset-color-select" value={inputfileObj.color}>
                         {colors.map(color => {
                                return (
                                    <option value={`${color}`}>{color[0].toUpperCase() + color.slice(1)}</option>
                                );
                         })}
                    </select>
                </div>

                <div className="asset-icon-upload">
                    <label for="icon-upload" className='form-label'>Add an icon for this upload:</label>
                         <input 
                            className='icon-upload-input' 
                            class='icon-upload'
                            id='icon-upload'
                            type="file"
                            onChange={upload.createFileInputHandler({
                                onBegin: ({cancel}) => setProgress(0),
                                onProgress: ({ progress }) => setProgress(progress),
                                onUploaded: ({ iconFileUrl }) => setIconFileUrl(iconFileUrl),
                                onError: (error) => setError(error)
                            })}>
                         </input>

                </div>

                <div className="asset-extra-upload">
                    <p>Submit any extra info about this asset:</p>
                    <p>For example brand of clothing </p>
                    <textarea name="assetExtra" id="assetExtra-area" cols="30" rows="10"  placeholder='example (brand: gucci, material: silk)'
                        onChange={e => setAssetExtra({...assetExtra, ...parseAssetExtra(e.target.value)})}>
                    </textarea>
                </div>

                
                <input type="submit" value="Submit"/>
                </form>
            </div>
    )
}