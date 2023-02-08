export default async function fetchModelByUsername(username){
    let searchParam = new URLSearchParams({username});
    let response = await fetch(`http://localhost:3005/models/?${searchParam}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        mode: 'cors'
    })

    if (response.ok) {
        let data = await response.json();
        return data.data;
    }
    else {
        return [];
    }
}
 