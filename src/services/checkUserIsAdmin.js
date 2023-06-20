export default async function checkUserIsAdmin(twitchUsername) {
    // TODO make endpoint for this; profit
    let response = await fetch(`http://localhost:3005/admins/${twitchUsername}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        mode: 'cors'
    });

    if (response.ok) {
        let data = await response.json();
        return data.data; 
    }
    else {
        // If something else happens block the route
        return false;
    }
}