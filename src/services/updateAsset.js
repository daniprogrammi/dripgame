export default async function updateAsset(assetid, updateDict) {
    let response = await fetch(`http://localhost:3005/asset/update/${assetid}`, {
        method: 'PUT',
        mode: 'cors',
        body: updateDict
    });

    if (response.ok) {
        let data = await response.json();
        return data ? true : false; // Decide whether or not we want this to return the updated obj
    } else {
        // Do an error handling
        return; 
    }
}