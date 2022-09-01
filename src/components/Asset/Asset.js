import React from "react";
import { useState, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";

export default function Asset({id, src, width, height, coords, inCloset}) {
    const style = coords ? { top: `${coords.y - height/2}px`, left: `${coords.x - width/2}px`, position: "relative"} : {margin:"auto"} ;
    
    // useEffect(() => {
    //   return () => {
    //     console.log("Using Effect Placeholder"); // Replace with function to crop img???????
    //   };
    // }, []); // Effect runs on mount
  
    const [onBoard, setOnBoard] = useState(false);
    
    const [{isDragging}, dragRef] = useDrag(() => (
      {
      type: "image",
      item: {id: id, src: src, width: width, height: height },
      collect: (monitor) => {
        // console.log(monitor.getItem());
        return {
        isDragging: !!monitor.isDragging()
        };
        
      },
      end: (item, monitor) => {
          let curPosition = monitor.getClientOffset() // TODO: Figure out way to get coords, this won't work
          if (monitor.didDrop()) { 
            // If dropped -- check where
            let carouselPosition = document.getElementsByClassName('assetCarouselDiv')[0].getBoundingClientRect();

            if (curPosition !== null && curPosition.x > carouselPosition.right + 30) {
              // Assume this was a real attempt to drop on the board 
              
            }
          let boardCoords = document.getElementById("BoardThing").getBoundingClientRect();
          let newPosition = {}
          if (curPosition !== null && curPosition.x > boardCoords.x)
            newPosition.x  = boardCoords.x - item.width;

          setOnBoard(true);
        }
      }
  
  
    }));
    if (inCloset == false && onBoard == true ) {
      console.log("On board?????"); // Return placeholder image?
    }
  // d-flex justify-content-center">
    return (
      <div className="assetDiv"> 
        <img className="asset" ref={dragRef} src={src} 
        id={`image-${id}`} 
        style={{ border: isDragging ? "5px solid blue" : "0px", ...style}}>
        </img>
      </div>
    );
  }
  