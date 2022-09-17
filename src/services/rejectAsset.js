export default async function rejectAsset(assetId) {
        let response = await fetch(`http://localhost:3005/assets/${assetId}/reject`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        mode: 'cors'
    })

    if (response.ok) {
        let data = await response.json(); // An array containing the data
        // Actually not gonna be any data for now
    } else {
        // Add error handling
        return [];
    }
}
