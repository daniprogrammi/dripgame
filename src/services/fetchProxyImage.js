export default async function fetchProxyImage(imageURL){
    let searchParam = new URLSearchParams({url: imageURL});
    let response = await fetch(`http://localhost:3005/canvas/download?${searchParam}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            mode: 'cors'
    });

    if (response.ok) {   
        return response.data;
    }
    else {
        return [];
    }
}