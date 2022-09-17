import { useEffect, useCallback, useState, useRef, useContext, createContext } from 'react';
import { fabric } from 'fabric';

import AssetCarousel from '../AssetCarousel/AssetCarousel.js';
import default_hair1 from '../../assets/Hair/cropped_hair1.png';
import default_body from '../../assets/Body/cropped_pose1.png';
import default_shirt1_pose1 from '../../assets/Tops/cropped_shirt1_pose1.png';
import default_bottom from '../../assets/Bottoms/cropped_pose1.png';
import face from '../../assets/Face/cropped_face1.png';
import { notDeepEqual } from 'assert';
import './Canvas.scss';

const picList = [{
  id: 1,
  src: default_shirt1_pose1,
  width: 134,
  height: 106, 
  category: 'Tops'
}, 
{
  id: 2,
  src: face,
  width: 94,
  height: 80, 
  category: 'Face' 
},
{
  id: 3,
  src: default_bottom
  ,  width: 106,
  height: 116 , 
  category: 'Bottom'

},
{
  id: 4,
  src: default_body
  ,  width: 161,
  height: 409 , 
  category: 'Body'
},
{
  id: 5,
  src: default_hair1
  ,  width: 141,
  height: 84 , 
  category: 'Hair'
}]

export function useCanvas(init, saveState = true) {
    const elementRef = useRef(null); // Ref to the canvas element
    const fc = useRef(null); // Ref to the canvas itself
    const data = useRef(null); // 
    const _init = useRef(init ? init.toString() : undefined); // not sure about this

    //set canvas reference 
    const setRef = useCallback((ref) => {
        elementRef.current = ref;

        if (fc.current && saveState)
            data.current = fc.current.toJSON();

        if (fc.current)
            fc.current.dispose();

        if (!ref) {
            fc.current = null;
            return;
        }

        const canvas = new fabric.Canvas(ref, {backgroundColor: 'white'});
        fc.current = canvas;

        init && init(canvas);

        if (saveState) {
            const initValue = init ? init.toString() : undefined;
            const initFunctionDidChange = initValue !== _init.current;
            data.current && !initFunctionDidChange && canvas.loadFromJSON(data.current, () => {});
            _init.current = initValue;
        }
    }, [init, saveState]);
    
    useEffect(() => {
        return () => {
            if (saveState && fc.current) {
                data.current = fc.current.toJSON();
            }

            if (!elementRef.current){
                if (fc.current) {
                    fc.current.dispose();
                }
                fc.current = null;
            }

        };
    }, [saveState]);
    return [fc, setRef];
        
}

export default function Canvas() {
    const [canvas, setCanvasRef] = useCanvas(canvas => {
        canvas.on('drop', e => {
            let event = e.e;
            event.dataTransfer.dropEffect = "move";
            let imageId = event.dataTransfer.getData("text/plain");
            let imgElement = document.getElementById(imageId);
            if (imgElement == null) {
                console.log("Drag unsuccessful");
            }
            else {
            // TODO: Handle duplicate images by checking the id of what's on the board currently
            // --- handle ordering either by implementing a sorting function (canvas._objects.sort())..
            // --- or by checking the item category (would require a db request?) OR add data-item = ""
            // ------- (event.target.dataset.item) as an attribute to send category
            // Background image can be added to canvas by canvas.backgroundImage = new fabric.Image.fromURL(src);

            let pointer = canvas.getPointer(event);
            let posx = pointer.x;
            let posy = pointer.y;

            let image = new fabric.Image.fromURL(imgElement.getAttribute('src'), (image, err) => {
                if (!err){
                image.set({
                angle: 0,
                opacity: 100,
                hasBorders: false,
                hoverCursor: imgElement.getAttribute('src'), // Can later change to be name of contributor etc
                left: posx,
                top: posy,
                });
            }
            canvas.add(image);
        });
        }});
        });

    const myRef = useRef(null);
    useEffect(() => {
        setCanvasRef(myRef.current);
    }, [myRef.current]);

   
    return (
        <div className='canvasDiv'>
            <div className='row'>
                <div className='col-md-12'>
                     <h3 className="pageContentTitle">Canvas</h3>  
                </div>
            </div>

            <div className='row'>
                <div className='col-md-3 carousel-side'>
                    <div className='assetCarouselDiv'>
                    {/* TODO: We'll have multiple carousels for each category of closet item */}
                    <AssetCarousel category="Test" carouselItems={picList}></AssetCarousel>
                    </div>
                </div>
                <div className='col-md-9'>
                    <canvas 
                        className='mainCanvas'
                        width={1260}
                        height={720}
                        ref={myRef}/>
            </div>
        </div>
            </div>
    )
}
