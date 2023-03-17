import { useState, useEffect, useContext, useRef } from 'react';
import { TextInput, Text } from '@mantine/core';
import { AssetListContext } from '../../providers/AssetListProvider.js';

// criteria - string => look for string in any of the key-values in assets?
// criteria - key/val pair => look for val in assets of that specific key?
// Let's go with string criteria
export default function Search({children}){
    const { filterAssets, refresh  } = useContext(AssetListContext);
    const [searchVal, setsearchVal] = useState(""); // criteria
    const inputRef = useRef(null);

    useEffect(() => {
            // Do stuff
            filterAssets(searchVal);
    }, [searchVal]); 
        // TODO: When there is a space in the search val, add the prev item to a list and allow user to input another item

    const clear = (event) => {
        setsearchVal("");
        refresh();
    };

    return <div className='search-box'>
                <TextInput 
                        ref={inputRef}
                        value={searchVal} 
                        onChange={(event) => setsearchVal(event.currentTarget.value)} 
                        placeholder="Filter assets"/> 
                <button className='clear-filters' onClick={(event) => clear(event)}>
                    Clear
                </button>
            </div>
    }