export default async function uploadAsset(assetObj){
  let response = await fetch(`http://localhost:3005/assets/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify({data: assetObj})
    });

    if (response.ok) {
        let data = await response.json(); // An array containing the data
        return data;
        
    } else {
        // Add error handling
        return null;
    }
};