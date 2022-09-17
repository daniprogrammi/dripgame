export default async function fetchAllAssets(approvedOnly=false, rejectedOnly=false){
    let response = await fetch('http://localhost:3005/assets', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        mode: 'cors'
    })

    if (response.ok) {
        let data = await response.json(); // An array containing the data
        if (approvedOnly && rejectedOnly) {
            return []; // eRROR HANDLING?
        }
        if (approvedOnly)
            return data.filter(assetObj => assetObj.approved);
        else if (rejectedOnly) 
            return data.filter(assetObj => assetObj.rejected);
        else { // Admins only
            return data.filter(assetObj => !assetObj.approved && !assetObj.rejected);
        }
    } else {
        // Add error handling
        return [];
    }
};

