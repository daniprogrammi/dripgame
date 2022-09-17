export default async function fetchModels(){

    let response = await fetch('http://localhost:3005/models', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        mode: 'cors'
    })

    if (response.ok) {
        let data = await response.json();
        return data;
    }
    else {
        return [];
    }
}
 