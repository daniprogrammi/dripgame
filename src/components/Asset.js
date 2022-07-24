import React from "react";
import { useState, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";

export default function Asset({id, src, width, height, coords, inCloset}) {
    const style = coords ? { top: `${coords.y - height/2}px`, left: `${coords.x - width/2}px`, position: "fixed"} : {};
    
    useEffect(() => {
      return () => {
        console.log("Using Effect Placeholder"); // Replace with function to crop img???????
      };
    }, []); // Effect runs on mount
  
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
  