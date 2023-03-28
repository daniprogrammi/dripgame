import { useState, useEffect, useRef, useContext } from 'react';
import { TextInput, Checkbox, Button, Group, Box, Select, Radio, Textarea, FileInput, Text } from '@mantine/core';
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { Upload } from 'upload-js';
import { Navigate, Redirect, useNavigate } from 'react-router-dom';
import CropFile from '../Upload/CropFile';
// Service calls
import createModel from '../../services/createModel';
import createContributor from '../../services/createContributor';
import fetchModels from '../../services/fetchModels';
import fetchContributorByUsername from '../../services/fetchContributorByUsername';
import fetchModelByUsername from '../../services/fetchModelByUsername';
import fetchAssetByUrl from '../../services/fetchAssetByUrl';
import uploadAsset from '../../services/uploadAsset';

import { useAuth0 } from '@auth0/auth0-react';
import { uploadedFileContext } from '../Upload/UploadWidget';
import validateStreamerName from '../../services/validateStreamerName';

const upload = new Upload({ apiKey: "free" });


export default function UploadForm({fileUrl, admin=false}){
    const [searchValue, onSearchChange] = useState(''); // Search form
    const [ ownerVal, setOwnerVal ] = useState("");
    const [ assetCat, setAssetCat ] = useState("");
    const [assetExtra, setAssetExtra] = useState({});
    const [inputfileObj, setInputFileObj] = useState({});

    const [iconFileUrl, setIconFileUrl] = useState(null);
    const [progress, setProgress] = useState(null);
    const [error, setError] = useState(null);

    const [modelMissingError, setModelMissingError] = useState(false);

    const [modelOptions, setModelOptions] = useState([]);

    const { user } = useAuth0();

    const [submittedState, setSubmittedState] = useState(false);

    let [croppedUrl, setCroppedUrl] = useState(""); 
   
    let fileUrlFromContext = useContext(uploadedFileContext);

    const categoryOptions = ['tops', 'bottoms', 'sets', 'shoes', 'accessories', 'hair', 'face', 'model', 'backdrop'];
    const colors = ['white', 'yellow', 'blue', 'red', 'green', 'black', 'brown', 'grey', 'purple', 'orange', 'pink', 'multicolor']

    // 
    const setCroppedDataFromChild = async(dataUrl) => {
        let blob = await (await fetch(dataUrl)).blob();
        let uploadedFile = await upload.uploadFile(blob);  

        setCroppedUrl(uploadedFile.fileUrl);
        console.log(`Set croppedDataUrl from child: ${uploadedFile.fileUrl}`)
    }

    useEffect(() => {
        (async () => {
            let modelOptions = await fetchModels();
            modelOptions = modelOptions.map(obj =>({'value': obj.username, 'label': obj.username}));
            console.log(modelOptions); 
            if (modelOptions && (modelOptions instanceof Array) && modelOptions.length > 0)
                setModelOptions(modelOptions);
        })();
    }, []);

    let nav = useNavigate();
    const routeChange = () => {
        nav(''); 
    }

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
        catch (e) {
            //TODO: Return error
            return {};
        }
    }

    // Useeffecthook
    const submitUploadForm = async (e) => {
        e.preventDefault();

        if (!inputfileObj.modelUsername) {
            setModelMissingError(true);
        }

        if (admin) {
            // Do something else and return
            // Set all of the data fields according to what the uploader put in their request
        }

        let uploadedUrl = fileUrl ? fileUrl : fileUrlFromContext;
        let storedFileUrl = await fetchAssetByUrl(uploadedUrl);
        if (storedFileUrl.length !== 0) {
            return (
                <div className='upload-error'>
                    <p>This file already uploaded</p>
                </div>
            );
        }
        else {
            let modelId;
                let modelObj = await fetchModelByUsername(inputfileObj.modelUsername);
                // TODO: Return an atomic val instead of an array?
                if (!modelObj || !modelObj._id) {
                    modelObj = await createModel(inputfileObj.modelUsername);
                }
                modelId = modelObj._id;

                let fileObj = {
                    "modelID": modelId,
                    "category": assetCat,
                    "label": inputfileObj.assetLabel,
                    "file": croppedUrl ? croppedUrl : uploadedUrl,
                    "twitchUsername": user.nickname,
                    "owner": ownerVal,
                    "assetExtra": {
                        "color": inputfileObj.color ? inputfileObj.color : null,
                        "icon": iconFileUrl ? iconFileUrl : null, // Either scale down assetFile or ask users to submit a 50x50 file
                        "briefDescription": inputfileObj.briefDescription ? inputfileObj.briefDescription : null, // Mostly for use in alt text for images
                        ...assetExtra
                    }
                };

                // Check that the contributor already exists if not create one here, can update later
                let contributor = await fetchContributorByUsername(user.nickname);
                if (!contributor) {
                    contributor = await createContributor({ 'twitchUsername': user.nickname });
                }

                let fileCreated = await uploadAsset(fileObj);
                if (fileCreated) {
                    console.log("Asset successfully created");
                
                // Use state; change state to true and then have this render
                setSubmittedState(true);
                }
       }
    }

    // reload(false) refreshes the component instead of the whole page
    let submittedDiv = (<div>
        <p>You did it!</p>
        <button onClick={() => window.location.reload(false)}> 
            Submit something else
        </button>
        </div>);
    return submittedState ? 
        submittedDiv
        : 
        (<div className='contribution-form'>
            <h3>Contribution Form:</h3>
            {/* <CropFile fileUrl={fileUrl} sendData={setCroppedDataFromChild}></CropFile> */}
            {/* Need to return or otherwise change the fileURL */}
            <form id='contribution-form' onSubmit={e => submitUploadForm(e)}>
                <div className={`asset-model-select ${modelMissingError ? 'asset-model-error error' : ''}`}>
                    {/* <label htmlFor='model-select-input'>Model's twitch username:</label> */}
                    <Select type="text"
                        label="Model's Twitch Username"
                        placeholder='Which streamer is this?'
                        name="model-select-input"
                        id="model-input"
                        searchable
                        creatable
                        getCreateLabel={(username) => `+ Add ${username}`}
                        onCreate={(username) => {
                            validateStreamerName(username).then((result) => {
                                if (result) {
                                    let createdItem = { 'value': username, 'label': username};
                                    setModelOptions((current) => [...current, createdItem]);
                                    setInputFileObj({ ...inputfileObj, modelUsername: username ? username : "" });
                                    return username;
                                } 
                                else {
                                    setModelMissingError(true); // Change this to take in an error message
                                }
                            });
                            }
                        }
                        searchValue={searchValue}
                        onSearchChange={onSearchChange}
                        onChange={e => setInputFileObj({ ...inputfileObj, modelUsername: e ? e : "" })}
                        nothingFound="Streamer not found"
                        // value={inputfileObj.modelUsername}
                        data={modelOptions}
                    />




                    {/* <datalist name="model-select" id="model-select-input">
                    {modelOptions.map(model => {
                        return (
                            <option value={`${model.twitchUsername}`}>{model[0].toUpperCase() + model.slice(1)}</option>
                        );
                    })}
                </datalist> */}
                    {modelMissingError ? (<div className='modelMissingError'> <p>Must input model</p></div>) : (<></>)}
                </div>

                <div className="asset-owner-input">
                    <Radio.Group
                        name="image-owner"
                        label="Are you the rightful owner of this image?:"
                        spacing="sm"
                        value={ownerVal}
                        onChange={e => {setOwnerVal(e)}} //not able to change radio btn NOT WORKING???
                    >
                        <Radio value={"true"} label='Yes'/>
                        <Radio value={"false"} label='No'/>
                    </Radio.Group>
                    
{/* 
                    <input title='Are you the rightful owner of this image?:' type="radio" name="asset-owner-input" id="asset-owner-input-yes" value={inputfileObj.owner} onChange={e => setInputFileObj({...inputfileObj, owner: true})}/>
                    <label htmlFor="asset-owner-input-yes">Yes</label>
                    <input type="radio" name="asset-owner-input" id="asset-owner-input-no" value={inputfileObj.owner} onChange={e => setInputFileObj({...inputfileObj, owner: false})}/>
                    <label htmlFor="asset-owner-input-no">No</label> */}
                    {/* </fieldset> */}
                </div>

                <div className="asset-category-div">
                    <label htmlFor="asset-category">
                        Asset category:
                    </label>

                        <Select id='asset-category-select' name='asset-category' value={assetCat} 
                                searchable
                                onChange={e => {setAssetCat(e)}}
                                data={categoryOptions.map(category => {
                                    return {value: category, label: category[0].toUpperCase() + category.slice(1)};
                                })}
                                
                                >
                            {/* {categoryOptions.map(category => {
                                return (
                                    <option value={`${category}`}>{category[0].toUpperCase() + category.slice(1)}</option>
                                );
                            })} */}
                        </Select>
                </div> 
                
                <div className="asset-label-div">
                    <label htmlFor="asset-label">Name for this asset:</label>
                    <TextInput type="text" value={inputfileObj.assetLabel} placeholder="Label here" id="asset-label" onChange={e => setInputFileObj({...inputfileObj, 'assetLabel': `${e.target.value}`})} />
                </div>
                <div className="asset-brief-description">
                    <label htmlFor='asset-brief-description-label'>Brief description:</label>
                    <Textarea name="asset-brief-description" id="asset-brief-description" cols="30" rows="4">
                    </Textarea>
                </div>
                {assetCat !== 'model' && assetCat !== 'face' ? 
                    (<div className="asset-color-select">
                        <label htmlFor="asset-color-select">
                                Color:
                        </label>                   
                        <Select 
                            name="asset-color-select" 
                            id="asset-color-select" 
                            value={inputfileObj.color}
                            onChange={e => setInputFileObj({...inputfileObj, color: e})}
                            data={colors.map(color => {
                                return {value: color, label: color[0].toUpperCase() + color.slice(1)};
                            })}
                            >
                            {/* {colors.map(color => {
                                    return (
                                        <option value={`${color}`}>{color[0].toUpperCase() + color.slice(1)}</option>
                                    );
                            })} */}
                        </Select>
                    </div>) 
                    : (<></>) 
                }

                {/* <div className="asset-icon-upload">
                    <label for="icon-upload" className='form-label'>Add an icon for this upload:</label>
                         <Dropzone 
                            className='icon-upload-input' 
                            class='icon-upload'
                            id='icon-upload'
                            accept={["image/png","image/jpeg","image/jpg"]}
                            placeholder='Your icon here'
                            aria-label='Your icon here'
                            onDrop={upload.createFileInputHandler({
                                onBegin: ({cancel}) => setProgress(0),
                                onProgress: ({ progress }) => setProgress(progress),
                                onUploaded: ({ iconFileUrl }) => setIconFileUrl(iconFileUrl),
                                onError: (error) => setError(error)
                            })}
                            >
                                <Group>
                                    <Dropzone.Accept>
                                    </Dropzone.Accept>
                                    <Dropzone.Reject>
                                    </Dropzone.Reject>
                                    <div>
                                        <Text size="xl" inline>
                                            Drag image here
                                        </Text>
                                    </div>
                                </Group>
                         </Dropzone>

                </div> */}

                <div className="asset-extra-upload">
                    <p>Submit any extra info about this asset:</p>
                    <Textarea name="assetExtra" id="assetExtra-area" cols="30" rows="10"  placeholder='Example (brand: gucci, material: silk)'
                        onChange={e => setAssetExtra({...assetExtra, ...parseAssetExtra(e.target.value)})}>
                    </Textarea>
                </div>

                <input type="submit" value="Submit" />
            </form>
        </div>
    )
}
