// Utility for user to crop the image before upload
import Cropper from 'react-cropper';
import "cropperjs/dist/cropper.css";
import { Upload } from 'upload-js';
import { useState, useEffect, useRef } from 'react';

const upload = new Upload({ apiKey: `${process.env.REACT_APP_UPLOADIO_API_KEY}` });

export default function UploadCropper({fileUrl, sendData}){
    const [image, setImage] = useState(fileUrl);
    const [cropData, setCropData] = useState("#");
    const [cropper, setCropper] = useState();
    const cropperRef = useRef(null);

    const [disableEdit, setDisableEdit] = useState(true);

    const [uploadedCrop, setUploadedCrop] = useState();

    const [progress, setProgress] = useState(null);
    const [error, setError] = useState(null);

    const onCrop = () => {
        console.log(fileUrl);
        const imageElement = cropperRef?.current;
        const cropper = imageElement?.cropper;
        if (typeof cropper !== undefined){
            setCropData(cropper.getCroppedCanvas().toDataURL());
            console.log("Helgfsgsdflo");
            console.log(cropData);
            // upload.createFileInputHandler({
            //         onBegin: ({cancel}) => setProgress(0),
            //         onProgress: ({ progress }) => setProgress(progress),
            //         onUploaded: ({ croppedImgUrl }) => setCroppedImgUrl(croppedImgUrl),
            //         onError: (error) => setError(error)
            //    })
        }
    };

    const onFinal = async() => {
        await sendData(cropData); // Sends to parent, parent does the other stuff
        // upload.createFileInputHandler({
        //     onUploaded: ({ croppedFile }) => setUploadedCrop(croppedFile),
        //     onError: (error) => setError(error)
        // })          
        //console.log(`Uploaded file: ${JSON.stringify(uploadedFile)} this url`);
    }

    const onToggleEdit = () => {
        setDisableEdit((prevState) => !prevState);
        console.log(`setting edit to ${disableEdit}`);
    }

    return <> 
        <Cropper id="get-to-the-cropper"
            enable={disableEdit}
            src={image}
            style={{ height: 400, width: "100%" }}
            initialAspectRatio={1}
            aspectRatio={NaN}
            guides={true}
            // preview=".img-preview"
            crop={onCrop}
            ref={cropperRef}
            viewMode={1}
            minCropBoxHeight={10}
            minCropBoxWidth={10}
            background={false}
            responsive={true}
            checkOrientation={false}
            onInitialized={(instance) => {
                setCropper(instance);
            }}
            >     
            </Cropper>
            <div>
                <div className="box" style={{ width: "50%", float: "right" }}>
                    <h1>Preview</h1>
                    {/* <div className="img-preview" style={{ width: "100%", float: "left", height: "200px" }}/> */}
                </div>
                <div className="box" style={{ width: "50%", float: "right", height: "200px" }}>
                    <button style={{ float: "right" }} 
                        onClick={() => {
                                    onCrop();
                                    onFinal();
                                    }
                                }>
                        Crop Image
                    </button>

                    <button onClick={onToggleEdit}>DisableEditing</button>
                </div>
            </div>
    </>
}