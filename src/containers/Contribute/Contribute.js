import '../../components/Upload/UploadFile';
import AuthdContribute  from '../../components/Auth/AuthdContribute';
import UploadFile from '../../components/Upload/UploadFile';
import Auth from '../../components/Auth/Auth';
import { useAuth0 } from '@auth0/auth0-react';
import { useState } from 'react';
import { uploadedFileContext } from '../../components/Upload/UploadWidget';

import './Contribute.scss';

export default function Contribute(){
    return (
        <div className="contributeDiv">
            <h3 className="contributeHeader containerTitle">
                Contribute to the Artwork here!
            </h3>

            <div className='styleGuide'>
                {/* TODO: Write and upload a style guide here */}
                <p>
                    Style guide eventually
                </p>
            </div>

            <div className="contributeContent">
                <uploadedFileContext>
                    <AuthdContribute></AuthdContribute>
                </uploadedFileContext>
            </div>
        </div>

    )
}