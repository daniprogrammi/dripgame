export default async function fetchAssetByUrl(assetUrl){
    let response = await fetch(`http://localhost:3005/assets/file/${assetUrl}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        mode: 'cors'
    })

    if (response.ok) {
        let data = await response.json(); // An array containing the data
        return data;
        
    } else {
        // Add error handling
        return [];
    }
};

