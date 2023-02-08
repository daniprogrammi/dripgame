// Utility for user to crop the image before upload
import Cropper from 'react-cropper';
import { Upload } from 'upload-js';
import { useState, useEffect, useRef } from 'react';

const upload = new Upload({ apiKey: "free" });

export default function UploadCropper({fileUrl}){
    const [croppedImgUrl, setCroppedImgUrl] = useState(fileUrl);
    const [progress, setProgress] = useState(null);
    const [error, setError] = useState(null);

    const cropperRef = useRef(null);

    const onCrop = () => {
        const imageElement = cropperRef.current;
        const cropper = imageElement.cropper;
        setCroppedImgUrl(cropper.getCroppedCanvas().toDataURL());
        console.log(croppedImgUrl);
        upload.createFileInputHandler({
                onBegin: ({cancel}) => setProgress(0),
                onProgress: ({ progress }) => setProgress(progress),
                onUploaded: ({ croppedImgUrl }) => setCroppedImgUrl(croppedImgUrl),
                onError: (error) => setError(error)
            })
    };

    return <Cropper
            src={fileUrl}
            style={{ height: 400, width: "100%" }}
            initialAspectRatio={ 16 / 9 }
            aspectRatio={NaN}
            guides={true}
            crop={onCrop}
            ref={cropperRef}
            >     
            </Cropper>
}