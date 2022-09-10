export default async function fetchContributorById(contributorId) {
    let response = await fetch(`http://localhost:3005/contributors/${contributorId}`, {
        method: 'GET',
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
};

