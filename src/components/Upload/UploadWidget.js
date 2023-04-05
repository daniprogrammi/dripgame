import { Uploader } from "uploader";
import { UploadButton } from "react-uploader";
import { createContext, useState } from 'react';


export const uploadedFileContext = createContext(null);

const uploader = Uploader({ apiKey: `${process.env.REACT_APP_UPLOADIO_API_KEY}` }); // Replace "free" with your API key.

export default function UploadWidget({onUploadRender}){
    const [fileUrl, setFileUrl] = useState(null);

    const uploadConf = { multi: false, 
                         maxFileSizeBytes: 10485760,
                            editor: { 
                                images: {
                                crop: true,
                                cropShape: "rect"
                                }
                        }
                    }
    
    if (fileUrl !== null){
       return (<uploadedFileContext.Provider>{onUploadRender(fileUrl)}</uploadedFileContext.Provider>); 
    }

    return (<uploadedFileContext.Provider value={fileUrl}>
            <UploadButton className='customFileInput'
                      id='artUpload'
                        uploader={uploader}
                        options={uploadConf}
                        onComplete={file => {
                            console.log(file);
                            console.log(file[0].fileUrl);
                            setFileUrl(file[0].fileUrl);

                        }}>
            {({onClick}) =>
            <button onClick={onClick}>
                Upload a file...
            </button>
            }
        </UploadButton>
        </uploadedFileContext.Provider>
    );        
}