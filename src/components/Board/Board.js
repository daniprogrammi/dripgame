
import { useDrop, useDrag, DragPreviewImage, useDragLayer } from 'react-dnd';
// import { getEventClientOffset } from 'react-dnd/src/OffsetUtils';
import { useState, useEffect, useRef } from 'react';
import Asset from '../Asset/Asset.js';
import AssetCarousel from '../AssetCarousel/AssetCarousel.js';
import { createContext, useContext } from 'react';
import './Board.css';

import default_hair1 from '../../assets/Hair/cropped_hair1.png';
import default_body from '../../assets/Body/cropped_pose1.png';
import default_shirt1_pose1 from '../../assets/Tops/cropped_shirt1_pose1.png';
import default_bottom from '../../assets/Bottoms/cropped_pose1.png';
import face from '../../assets/Face/cropped_face1.png';
// todo: limit the amount of stuff that can be on the canvas at once thnx
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
}

]

 const AssetContext = createContext({assets: []}); // pass by val/ref????

 const AssetState = ({children}) => {
    const [assetState, setAssetState] = useState({
      assets: [],
      addAsset: (newAsset) => {
        setAssetState((oldAssets) => 
        {
          let returnAssets = [];

          if (!oldAssets.assets.find((element) => newAsset.id === element.id)) {
            returnAssets.push(newAsset);
            returnAssets.push(...oldAssets.assets)
          } else {
            let newElem;
            for (let element of oldAssets.assets) {
              if (element.id === newAsset.id) {
                newElem = { id:element.id, src: element.src, width: element.width, height: element.height, coords: newAsset.coords }
                //element.coords = newAsset.coords;
                break;
              }
            };
            returnAssets.push(...oldAssets.assets.filter((item) => item.id !== newAsset.id ));
            returnAssets.push(newElem);
          }

          return {
            ...oldAssets,
            assets: returnAssets
          };
        }
        );
      }
    });

    return (
      <AssetContext.Provider value={assetState}>{children}</AssetContext.Provider>
    );
 }

function Canvas(){
    const [board, setBoard] = useState([]);
    const canvasRef = useRef(null);
  
    let assets = useContext(AssetContext); // Eventually will need to do some await db.getAllAssets() or something
  
    const [{ isOver, clientOffset }, drop] = useDrop(() => ({
      accept: "image",
      drop: (item, monitor) => addImageToBoard(item, canvasRef, monitor.getClientOffset(), monitor.getInitialClientOffset()),
      collect: (monitor, props) => {
        return {
          isOver: !!monitor.isOver(),
          initialOffset: monitor.getInitialClientOffset(),
          clientOffset: monitor.getClientOffset(),
          }
      }
      
    }));
    console.log("ClientOffset -> " + JSON.stringify(clientOffset));
    let lastCoords = clientOffset;


    // I feeeeeelll that we should be adding the Asset COMPONENT to the context list
    const addImageToBoard = (item, canvasRef, coords, initialCoords) => {
      //let curAsset = <Asset inCloset={false} key={`key${item.id}`} src={item.src} id={item.id} width={item.width} height={item.height} coords={coords}></Asset>;
      let boardCoords = document.getElementById("BoardThing").getBoundingClientRect();
      console.log(coords);
      console.log(`BoardCoords: ${JSON.stringify(boardCoords)}`);
      console.log(`${JSON.stringify(initialCoords)}`)
      console.log(`x scroll: ${window.scrollX} y scroll: ${window.scrollY} `);
      let updatedCoords = {x: Math.abs(coords.x - initialCoords.x), y: Math.abs(coords.y - window.scrollY - initialCoords.y) }
      assets.addAsset({id: item.id, src: item.src, width: item.width, height: item.height, coords: updatedCoords });
      console.log(`Updated coords: ${JSON.stringify(updatedCoords)}`);
      // updateContext
      //return curAsset;
    }

    
    
    // const addImageToBoard = (id, canvasRef, coordinates) => {
    //   console.log(id);

    //   const pictureList = assets.filter((picture) => id === picture.id);
    //   pictureList[0].coords = coordinates;

    //   setBoard((board) => [...board, pictureList[0]]);
    //   // let canvas = canvasRef.current;
    //   // let ctx = canvas.getContext('2d');
    //   // ctx.drawImage(document.querySelector(`#image-${id}`), x, y, 500, 500)
    //   console.log(`Img drawn at ${coordinates.x}, ${coordinates.y} `);
    // };
  
    // Don't necessarily need to pass an asset in using the useDrop fn we could create a new asset
    // MOST importantly we need to not recreate the asset on every move while it's on the board
    return (
      <div>
        <div className='col-md-9'>
            <div className='assetCarouselDiv' style={{backgroundColor: "lightblue"}}>
              {/* TODO: We'll have multiple carousels for each category of closet item */}
              <AssetCarousel category="Test" carouselItems={picList}></AssetCarousel>
            </div>
          </div>
          <div id="BoardThing" className="Board col-md-9" ref={drop} style={{maxWidth:"100%", width: "1500px", height: "1000px", border: "2px red solid", position: "absolute"}}>
            <p>Board</p>
            {assets.assets.map((item) => {
                  return (<Asset inCloset={false} key={`key${item.id}`} src={item.src} id={item.id} width={item.width} height={item.height} coords={item.coords}></Asset>);
            })}
            
            {/* <canvas id="MainCanvas" 
              ref={canvasRef}
              width="600"
              height="400" 
              style={{border:"1px solid #000000"}}
              onMouseMove={handleMouseMove}> 
      
            </canvas> */}
          
          {/* <button className='btn-primary btn col-md-4'>BOARD THINGS</button> */}
          
      {/* style={"border:1px solid #000000;"} */}
          </div>
          {/* <div>{{(assets.assets) => (<p>{item}</p>)}</div> */}
      </div>
    );
  }

  export default function Board() {
    return ( 
      <div className='board-container row flex-nowrap'>
      <AssetState>
        <Canvas></Canvas>
      </AssetState>
      </div>
    )
  }