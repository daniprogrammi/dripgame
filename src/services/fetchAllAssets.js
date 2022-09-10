export default async function fetchAllAssets(approvedOnly=false){

    let response = await fetch('http://localhost:3005/assets', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        mode: 'cors'
    })

    if (response.ok) {
        let data = await response.json(); // An array containing the data
        if (approvedOnly)
            return data.filter(assetObj => assetObj.approved);
        else
            return data;
    } else {
        // Add error handling
        return [];
    }
};

