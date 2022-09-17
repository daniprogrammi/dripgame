export default async function createModel(twitchUsername){
    // Validate this is a real twitchUser
    let response = await fetch('http://localhost:3005/models', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify({'username': twitchUsername})
    })

    if (response.ok) {
        let data = await response.json();
        return data; // returns modelObj 
    }
    else {
        return [];
    }
}
