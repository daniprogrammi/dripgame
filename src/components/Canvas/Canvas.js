import { useEffect, useCallback, useState, useRef, useContext, createContext, useMemo } from 'react';
import { fabric } from 'fabric';

import BottomBar from './BottomBar.js';

import AssetCarousel from '../AssetCarousel/AssetCarousel.js';
import './Canvas.scss';
import fetchAllAssets from '../../services/fetchAllAssets.js';
import fetchAllCategories from '../../services/fetchAllCategories.js';

import Search from '../Search/Search.js';

import { AssetListContext } from '../../providers/AssetListProvider.js';

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

        const canvas = new fabric.Canvas(ref, {backgroundColor: 'white', perPixelTargetFind: true, renderOnAddRemove: true , preserveObjectStacking: true});
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
    const [itemsOnCanvas, setItemsOnCanvas] = useState([]);
    const [canvas, setCanvasRef] = useCanvas(canvas => {
            let currentCanvas = loadCanvas(); 
            if (currentCanvas){
                try {
                    canvas.loadFromJSON(currentCanvas);
                }
                catch (e) {
                    console.log(`Couldn't load canvas from cache (${e}`);
                }
            }
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
                        addImageBtn(image, imageId);
                    }, {crossOrigin: 'anonymous'});
                
                }})

                canvas.on('object:removed', (removalEvent)=>{
                    let originalImg = removalEvent.target._originalElement;
                    const imgSrc = originalImg.getAttribute('src');

                    let btns = document.querySelector("[id^=btn-image]")
                    let btnToRemove;
                    if (btns instanceof HTMLButtonElement) {
                        btnToRemove = btns;
                    }
                    else if (btns instanceof Array){
                        for (let btn of btns){
                            if (btn.firstChild.getAttribute('src') == imgSrc){
                                btnToRemove = btn;
                                break;
                            }
                        }
                    }
                    
                    let newArr = itemsOnCanvas.filter((val) => val !== btnToRemove);
                    setItemsOnCanvas(newArr);
                    
                })
            }
    );

    const addImageBtn = (fabricImg, imageId) => {
        const imageSrc = fabricImg.getSrc();
        let newElem = <button id={`btn-${imageId}`} onClick={(event)=>{setActiveObject(fabricImg, event)}}>
                <img data-btn={`btn-${imageId}`} src={imageSrc} width={25} height={25}></img>
                </button>
        setItemsOnCanvas([...itemsOnCanvas, newElem]);

    }
    // TODO: Add buttons for all objects currently on the canvas when loading cache
    // TODO: Remove buttons for objects when they are removed from the canvas/canvas expires

    const setActiveObject = (img, event) => {
        let currCanvas = canvas.current;
        currCanvas.setActiveObject(img, event);
        let selectedImage = currCanvas.getActiveObject();
        //TODO: Somehow make it apparent that the object has indeed been selected
    }

    // Canvas controls
    const remove = (imageRef) => {
        // Check if objects on canvas are the same object returned by imageRef 
        let currCanvas = canvas.current;
        let selectedImage = currCanvas.getActiveObject();
        let imgElem = selectedImage.getElement();
                // if (currCanvas && currCanvas.getObjects().includes(imageRef.current)) {
            // If object is on canvas
        currCanvas.remove(selectedImage);
        // }
    }

    const moveImageUp = () => {
        // 
        let currCanvas = canvas.current;
        let selectedImage = currCanvas.getActiveObject();
            // 
        currCanvas.bringForward(selectedImage, false);//, true);
    } 

    const moveImageBack = () => {
        // 
        let currCanvas = canvas.current;
        let selectedImage = currCanvas.getActiveObject();
        currCanvas.sendBackwards(selectedImage, false);//, true);
    } 

    const getActiveObject = (event) => {
        console.log(canvas.current.getActiveObject());
    }

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
        localStorage.setItem('currentCanvas', JSON.stringify(storedCanvasData));
    }; 
    
    // Load canvas state
    const loadCanvas = () => {
        let storedCanvasData = localStorage.getItem('currentCanvas');
        return storedCanvasData;
    }

    let { currAssets, fetchList } = useContext(AssetListContext);
    //let [assetList, setAssetList] = useState([]); // Maybe use ref instead
   // let assetList = useRef([]);
    
    const myRef = useRef(null);
    useEffect(() => {
        setCanvasRef(myRef.current);
    }, [myRef.current]);

    // Get all images
    useEffect(() => {
       const res = fetchList().then(console.log("Fetched Data"));        
    }, []);

    // Group images by category
    useEffect(() => {
        let groupItems = async () => {
            let allCategories = await fetchAllCategories();
            allCategories = allCategories.data;
            let currentAssets = currAssets;
            let missingKeys = allCategories.filter(x => !Object.keys(currentAssets).includes(x));

            //TODO: Include all asset categories
            let _groupedItems = currentAssets.reduce((acc, item) => { 
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

        groupItems().then(console.log("grouped items!"));
    }, [currAssets]);

    return (
        <div className='canvasDiv'>
            <div className='main-canvas asset-select-column carousel-side'>
                    {
                    Object.keys(groupedItems).map(categoryName => {
                        return (
                            <AssetCarousel categoryName={categoryName} carouselItems={groupedItems[categoryName]}></AssetCarousel>
                        );
                    })}    
                    <Search></Search>
            </div>
                <div className='main-canvas canvas-column'>
                    {itemsOnCanvas}
                    <button onClick={(event) => {getActiveObject(event)}}>o</button>
                    <button onClick={(event) => {remove(event)}}>x</button>
                    <button onClick={(event) => {moveImageUp(event)}}>^</button>
                    <button onClick={(event) => {moveImageBack(event)}}>v</button>
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
