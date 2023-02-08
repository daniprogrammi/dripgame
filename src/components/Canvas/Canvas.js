import { useEffect, useCallback, useState, useRef, useContext, createContext } from 'react';
import { fabric } from 'fabric';

import BottomBar from './BottomBar.js';

import AssetCarousel from '../AssetCarousel/AssetCarousel.js';
import './Canvas.scss';
import fetchAllAssets from '../../services/fetchAllAssets.js';
import fetchAllCategories from '../../services/fetchAllCategories.js';

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

        const canvas = new fabric.Canvas(ref, {backgroundColor: 'white', perPixelTargetFind: true });
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
    const [groupedItems, setgroupedItems] = useState({});
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
            
            // Created new endpoint to download from server instead of from the image host directly
           let searchParam = new URLSearchParams({url: imgElement.getAttribute('src')}); 
           let requestImageUrl = `http://localhost:3005/canvas/download?${searchParam}`;

           let image = new fabric.Image.fromURL(requestImageUrl, (image, err) => {
                    if (!err){
                        if (image.width > canvas.getWidth() || image.height > canvas.getHeight()){
                            let scaleFactor = Math.min(canvas.getWidth()/image.width, canvas.getHeight()/image.height);
                            image.set({scaleX: scaleFactor, scaleY: scaleFactor});
                        }
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
            }, {crossOrigin: 'anonymous'});

         }})
    }
    );
    
    useEffect(() => {
        
        const cacheInterval = setInterval(() => {
            console.log("Caching canvas I hope!")
            saveCanvas();
        }, 100000);
        return () => clearInterval(cacheInterval);
    }, []);

    // Save canvas state
    const saveCanvas = () => {
        let storedCanvasData = canvas.current.toJSON();
        localStorage.setItem('currentCanvas', storedCanvasData);
    }; 

    // Load canvas state
    const loadCanvas = () => {
        let storedCanvasData = localStorage.getItem('currentCanvas');
        if (storedCanvasData != null) {
            canvas.current.loadFromJSON(storedCanvasData);
        }
    }

    let [assetList, setAssetList] = useState([]);
    
    const myRef = useRef(null);
    useEffect(() => {
        setCanvasRef(myRef.current);
    }, [myRef.current]);

    // Get all my images for me plz
    useEffect(() => {
        // TODO: A fetchAssetByModel function
        const fetchList = async () => {
            const picList = await fetchAllAssets(true, false);
            if (picList.length === 0){
                // .... PANIC
                console.log("No assets to serve :( ");
            }
            else {
                setAssetList(picList);
            }
        
        let allCategories = await fetchAllCategories();
        allCategories = allCategories.data;

        let missingKeys = allCategories.filter(x => !Object.keys(picList).includes(x));

        let _groupedItems = picList.reduce((acc, item) => { 
            const categoryName = item.category.name; 
            if (!acc[categoryName]) {
                acc[categoryName] = []; 
            } 
            acc[categoryName].push(item); 
            return acc; 
        }, {});

        
        setgroupedItems(_groupedItems);
        console.log(_groupedItems);
    }
        const res = fetchList().then(console.log("Fetched Data"));        
   }, []);


   
    return (
        <div className='canvasDiv'>
            <div className='main-canvas asset-select-column carousel-side'>
                    {
                    Object.keys(groupedItems).map(categoryName => {
                        return (
                            <AssetCarousel categoryName={categoryName} carouselItems={groupedItems[categoryName]}></AssetCarousel>
                        );
                    })}            
            </div>
                <div className='main-canvas canvas-column'>
                    <canvas 
                        className='mainCanvas'
                        width={1280}
                        height={720}
                        ref={myRef}/>
                </div>

                {/* BottomBar */}
                <BottomBar canvas={canvas}></BottomBar>
        </div>
    )
}
