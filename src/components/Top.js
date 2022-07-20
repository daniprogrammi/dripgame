import React from 'react';

import { useDrop, useDrag, DragPreviewImage } from 'react-dnd';
import { useState, useEffect } from 'react';

export default function Top(imagePath) {
    const [{ isDragging }, dragRef] = useDrag({
      type: 'top',
      item: { },
      collect: (monitor) => ({
          isDragging: monitor.isDragging()
      })
    })
  
    return (
        <div className="single-top">
          <img className='single-top-image' ref={dragRef} src={imagePath}></img>
        </div>
      );
  }