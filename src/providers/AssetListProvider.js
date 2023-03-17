import { createContext, useState, useCallback } from 'react';
import fetchAllAssets from '../services/fetchAllAssets';

export const AssetListContext = createContext({
        assetList: null,
        currAssets: null,
        setAssetList: () => {},
        filterAssets: () => {},
        fetchList: () => {},
        refresh: () => {}
    });

export function AssetListProvider({children}) {
    const [assetList, setAssetList] = useState([]);
    const [currAssets, setCurrAssets] = useState([]);
    // Put fetch all assets in here for a refresh of data
    
    const fetchList = async () => {
            // Refresh
            const picList = await fetchAllAssets(true, false);
            if (picList.length === 0){
                // .... PANIC
                console.log("No assets to serve :( ");
            }
            else {
                setAssetList(picList);
                setCurrAssets(picList); // 
            }
        }
    
    const refresh = () => {
        setCurrAssets(assetList);
    }

    const filterAssets = (searchVal) => { 
        if (assetList && assetList.length !== 0) {
                let newAssets = assetList.map((assetObj) => {
                    for (const [key, value] of Object.entries(assetObj)) {
                        if (value !== undefined && typeof(value) == 'string' && value.includes(searchVal)){
                            return assetObj;
                        }
                    }
                    return null;
                    }
                );
                let filteredAssets = newAssets.filter((assetObj) => assetObj !== null);
                console.log(`New asset length: ${filteredAssets.length}`);
                setCurrAssets(filteredAssets); // FOR SCIENCE!
            };
    };

    const contextValue = {
        assetList,
        currAssets,
        setCurrAssets: (newList) => {setCurrAssets(newList)},
        filterAssets: useCallback((searchVal) => filterAssets(searchVal)),
        fetchList: fetchList,
        refresh
    };

    return (
        <AssetListContext.Provider value={contextValue}>
            {children}
        </AssetListContext.Provider>
    );
}

