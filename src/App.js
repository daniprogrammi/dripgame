import logo from './logo.svg';
import default_hair1 from './assets/Hair/cropped_hair1.png';
import default_body from './assets/Body/cropped_pose1.png';
import default_shirt1_pose1 from './assets/Tops/cropped_shirt1_pose1.png';
import default_bottom from './assets/Bottoms/cropped_pose1.png';

import face from './assets/Face/cropped_face1.png';

import assets from './js/data';

import { Droppable, DragDropContext, Draggable  } from 'react-beautiful-dnd';

import './App.css';
import React from 'react';

import { useDrop, useDrag, DragPreviewImage, useDragLayer } from 'react-dnd';
import { useState, useEffect } from 'react';



const Top = () => {
  const [{ isDragging }, dragRef] = useDrag({
    type: 'top',
    item: { },
    collect: (monitor) => ({
        isDragging: monitor.isDragging()
    })
  })

  return (
      <div className="tops">
        <p>
          Top
        </p>
        <img className='tops' ref={dragRef} src={default_shirt1_pose1}></img>
      </div>
    );
}



export const Basket = () => {
  const [basket, setBasket] = useState([])
  const [{ isOver }, dropRef] = useDrop({
      accept: 'top',
      drop: (item) => setBasket((basket) => 
                          !basket.includes(item) ? [...basket, item] : basket),
      collect: (monitor) => ({
          isOver: monitor.isOver()
      })
  })

  return (
      <React.Fragment>
          <Top/>
          <div className='basket' ref={dropRef}>
              <Top />
              {isOver && <div>Drop Here!</div>}
          </div>
      </React.Fragment>
  )
}

// const originalTop = default_shirt1_pose1;

let imagePath = default_shirt1_pose1;
let originalImg = new Image();
originalImg.src = imagePath;


const picList = [{
  id: 1,
  src: default_shirt1_pose1,
  width: 134,
  height: 106 
}, 
{
  id: 2,
  src: face,
  width: 94,
  height: 80 
},
{
  id: 3,
  src: default_bottom
  ,  width: 106,
  height: 116 

},
{
  id: 4,
  src: default_body
  ,  width: 161,
  height: 409 
},
{
  id: 5,
  src: default_hair1
  ,  width: 141,
  height: 84 
}

]

function Picture({id, src, width, height, coords, inCloset}) {
  const style = coords ? { top: `${coords.y - height/2}px`, left: `${coords.x - width/2}px`, position: "fixed"} : {};
  
  React.useEffect(() => {
    return () => {
      console.log("Using Effect Placeholder"); // Replace with function to crop img???????
    };
  }, []);

  const [onBoard, setOnBoard] = useState(false);
  
  const [{isDragging}, dragRef] = useDrag(() => (
    {
    type: "image",
    item: {id: id},
    collect: (monitor) => {
      console.log(monitor.getItem());
      return {
      isDragging: !!monitor.isDragging()
      };
      
    },
    end: (item, monitor) => {
      if (monitor.didDrop() == true) {
        setOnBoard(true);
      }
    }


  }));
  if (inCloset == true && onBoard == true ) {
    return null;
  }

  return (
    <img ref={dragRef} src={src} 
    id={`image-${id}`} className="canvas" 
    style={{ border: isDragging ? "5px solid blue" : "0px", ...style }}>
    </img>
  );
}

// TODO: Monitor coords when item is being dragged. On click, the event coords seem to stop updating
// TODO: Change image bg to transparent, 
function DragDrop() {
  const [board, setBoard] = useState([]);
  const canvasRef = React.useRef(null);


  const [{ isOver, clientOffset }, drop] = useDrop(() => ({
    accept: "image",
    drop: (item, monitor) => addImageToBoard(item.id, canvasRef, monitor.getClientOffset()),
    collect: (monitor, props) => {
      return {
        isOver: !!monitor.isOver(),
        initialOffset: monitor.getInitialClientOffset(),
        clientOffset: monitor.getClientOffset(),
        }
    }
    
  }));


  const addImageToBoard = (id, canvasRef, coordinates) => {
    console.log(id);
    const pictureList = assets.filter((picture) => id === picture.id);
    pictureList[0].coords = coordinates;
    setBoard((board) => [...board, pictureList[0]]);
    // let canvas = canvasRef.current;
    // let ctx = canvas.getContext('2d');
    // ctx.drawImage(document.querySelector(`#image-${id}`), x, y, 500, 500)
    console.log(`Img drawn at ${coordinates.x}, ${coordinates.y} `);
  };

  return (
    <>
    <div className='col-md-3'>
    <div className='Pictures'>
      {assets.map(picture => {
          return <Picture inCloset={true} key={`key${picture.id}`} src={picture.src} id={picture.id} width={picture.width} height={picture.height}/>;
        })}
    </div>
    </div>
    <div className="Board col-md-9" ref={drop} style={{maxWidth:"100%", width: "1500px", height: "1000px", border: "2px red solid", position: "relative"}}>
      <p>Board</p>

     
      {/* <canvas id="MainCanvas" 
        ref={canvasRef}
        width="600"
        height="400" 
        style={{border:"1px solid #000000"}}
        onMouseMove={handleMouseMove}> 

      </canvas> */}
    
    <button className='btn-primary btn col-md-4'>BOARD THINGS</button>
    
{/* style={"border:1px solid #000000;"} */}
    </div>
    </>
  );
}

function Board(props) {
  return (
    <div className="Board col-md-8" ref={props.dropRef}>
      <p>Board</p>
      {/* {board.map((picture) => {
        return <Picture src={picture.src} id={picture.id}/>;
      })} */}
    <canvas id="MainCanvas" 
      ref={props.canvasRef}
      width={props.width == null ? "600" : `${props.width}` }
      height={props.width == null ? "600" : `${props.width}` }
      style={{border:"1px solid #000000"}}
      onMouseMove={props.mouseMoveFunc}> 
    </canvas>
    <div
      onMouseMove={props.mouseMoveFunc}
      style={{padding: '3rem', backgroundColor: 'lightgray'}}>
    </div>
  </div>
  );
}

function App() {
  return (
    <div className='App row flex-nowrap'>
      {/* <Top /> */}
      <DragDrop />

    </div>
  );
}

function Collection(){
  return (
    <div className='clothing-collection'>
      {/* Sections of clothing for the game */}

    </div>
  );
}

export default App;
export { Top, DragDrop, Picture, originalImg};

// ???????????????????????
// <DragDropContext onDragEnd={(param) => {
//   const srcIndex = param.source.index;
//   const destIndex = param.destination.index;
// }}>
//   <h1>Drop Below</h1>
//   <Droppable droppableId='droppable-1'>
//     {(provided, _) => (
//       <div ref={provided.innerRef} {...provided.droppableProps}>
//         {list.map((item, i) => (
//           <Draggable key={`draggable-${item.id}`} draggableId={`draggable-${item.id}`} index={i}>
//             {(provided, snapshot) => (
//               <div id={`draggable-${item.id}`} ref={provided.innerRef} 
//                       className='itemDiv card' {...provided.draggableProps} 
//                       {...provided.dragHandleProps} >
//                <span>{item.name}</span>
//                {console.log(i)}
//               </div>
//             )}
//           </Draggable>
//         ))}
//         {provided.placeholder}
//     </div>
//     )}
 
//   </Droppable>
// </DragDropContext>