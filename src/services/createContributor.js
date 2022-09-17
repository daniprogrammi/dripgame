export default async function createContributor(contributorObject) {
    let response = await fetch(`http://localhost:3005/contributors/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify({data: contributorObject})
    });

    if (response.ok) {
        let data = await response.json(); // An array containing the data
        return data;
        
    } else {
        // Add error handling
        return null;
    }
};

