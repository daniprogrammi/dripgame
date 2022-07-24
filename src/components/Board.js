
import { useDrop, useDrag, DragPreviewImage, useDragLayer } from 'react-dnd';
import { useState, useEffect, useRef } from 'react';


export default function Board({assets}) {
    const [board, setBoard] = useState([]);
    const canvasRef = useRef(null);
  
  
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
      <div className='board-container row flex-nowrap'>
      <div className='col-md-3'>
      <div className='Pictures'>
        {/* TBD */}
      </div>
      </div>
      <div className="Board col-md-9" ref={drop} style={{maxWidth:"100%", width: "1500px", height: "1000px", border: "2px red solid", position: "relative"}}>
        <p>Board</p>
  
        {/* {board.map((picture) => {
          return <Picture inCloset={false} key={`key${picture.id}`} {...picture}/>;
        })} */}
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
      </div>
    );
  }