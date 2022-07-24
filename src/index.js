import React from 'react';

import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import ReactDOM from 'react-dom/client';
import * as ReactDOMClient from 'react-dom/client';

import './index.css';
import App from './App';
import { Top } from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <DndProvider backend={HTML5Backend}>
        <App />
      </DndProvider>
  </React.StrictMode>
);


// originalImg.addEventListener('load', function() {
 
//   const originalWidth = originalImg.naturalWidth;
//   const originalHeight = originalImg.naturalHeight;

//   const aspectRatio = originalWidth/originalHeight;

//   let newWidth = 500;
//   let newHeight = newWidth/aspectRatio;

//   let canvas = ReactDOM.get
//   canvas.width = newWidth;
//   canvas.height = newHeight;
   
//   ctx.drawImage(originalImg, 0, 0, newWidth, newHeight);
// });

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
