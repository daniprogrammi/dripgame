export default async function validateStreamerName(streamerName){
    let response = await fetch(`http://localhost:3005/twitch/${streamerName}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        mode: 'cors'
    })

    if (response.ok) {
        let data = await response.json();
        return data.data; // true or false
    }
    else {
        return false;
    }
}
 