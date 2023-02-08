import React from 'react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useDrag } from 'react-dnd'
// Click to add to canvas vs dragging to canvas ux

export default function CanvasAsset({id, src , width, height, coords, inCloset}){
    const style = coords ? { top: `${coords.y - height/2}px`, left: `${coords.x - width/2}px`, position: "relative"} : {margin:"auto"} ;
     const drag_handler = (event) => {
        // Does it just "know" that the event target is the div child???
        //console.log(`${event.target.id}`);
        let divElem = document.getElementById(event.target.id);
        let imageTarget = divElem.children[0];
        event.dataTransfer.setData('text/plain', imageTarget.getAttribute('id'));
        event.dataTransfer.effectAllowed = "move";

    }

    const dragEndHandler = (event) => {
        //TODO: How do we know that drag was successful? 
        let divElem = document.getElementById(event.target.id);
        divElem.setAttribute('background-color', 'grey');
        divElem.setAttribute('opacity', '0.9');
    }

    return (
        <div id={`image-${id}-div`} 
        draggable={true}
        onDragStart = {e => {drag_handler(e)}}
        onDragEnd = {e => {dragEndHandler(e)}}
        style={{height: "auto", width: "auto"}}
        >
        <img className="asset" src={src} 
        id={`image-${id}`}
        style={{pointerEvents:'none', height: "100px", width: "100px"}} 
        >
        </img>
        </div>
    );
        // style={{ border: isDragging ? "5px solid blue" : "0px", ...style}}

}