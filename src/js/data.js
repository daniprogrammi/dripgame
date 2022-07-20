import default_hair1 from '../assets/Hair/cropped_hair1.png';

import default_body from '../assets/Body/cropped_pose1.png';

import default_shirt1_pose1 from '../assets/Tops/cropped_shirt1_pose1.png';
import cropped_pose2 from '../assets/Body/cropped_pose2.png';

import face1 from '../assets/Face/cropped_face1.png';
import face2 from '../assets/Face/face2.png';

import default_bottom from '../assets/Bottoms/cropped_pose1.png';
import bottom2 from '../assets/Bottoms/pose2__grey_leather_skirt.png';


let assets = [ 
        {
        id: 1,
        src: default_shirt1_pose1,
        width: 134,
        height: 106,
        type: 'top'
    },
    {
        id: 8,
        src: cropped_pose2,
        width: 140,
        height: 100,
        type: 'body'
    },
    
    {
        id: 2,
        src: face1,
        width: 94,
        height: 80,
        type: 'face'
    },
    {
        id: 3,
        src: default_bottom
        ,width: 106,
        height: 116,
        type: 'bottom'
        
    },
    {
        id: 4,
        src: default_body
        ,  width: 161,
        height: 409,
        type: 'body' 
    },
    {
        id: 5,
        src: default_hair1
        ,  width: 141,
        height: 84,
        type: 'hair' 
    },


]

export default assets;