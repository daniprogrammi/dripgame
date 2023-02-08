export default async function approveAsset(assetId) {
        assetId = assetId.toString();
        let response = await fetch(`http://localhost:3005/assets/${assetId}/approve`, {
        method: 'PUT',
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
}
