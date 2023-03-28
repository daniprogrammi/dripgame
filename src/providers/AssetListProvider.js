import { createContext, useState, useCallback } from 'react';
import fetchAllAssets from '../services/fetchAllAssets';

export const AssetListContext = createContext({
        assetList: null,
        modelAssets: null,
        currAssets: null,
        setAssetList: () => {},
        filterAssets: () => {},
        fetchList: () => {},
        filterAssetsByModel: () => {},
        refresh: () => {}
    });

export function AssetListProvider({children}) {
    const [assetList, setAssetList] = useState([]);
    const [modelAssets, setModelAssets] = useState([]);
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
                //setCurrAssets(picList); // 
            }
        }
    
    const refresh = () => {
        setCurrAssets(modelAssets);
    }

    const filterAssets = (searchVal) => { 
        if (modelAssets && modelAssets.length !== 0) {
                let newAssets = modelAssets.map((assetObj) => {
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

    const filterAssetsByModel = (modelId) => {
        if (assetList && assetList.length !== 0){
            let newAssets = assetList.filter((assetObj) => {
                console.log(`${assetObj.modelID} === ${modelId}`);
                return assetObj.modelID === modelId});
            setModelAssets(newAssets);
            setCurrAssets(newAssets);
        } else {
            return null;
        }
    } 

    const contextValue = {
        assetList,
        modelAssets,
        currAssets,
        setCurrAssets: (newList) => {setCurrAssets(newList)},
        filterAssets: useCallback((searchVal) => filterAssets(searchVal)),
        fetchList: fetchList,
        filterAssetsByModel: filterAssetsByModel,
        refresh
    };

    return (
        <AssetListContext.Provider value={contextValue}>
            {children}
        </AssetListContext.Provider>
    );
}

