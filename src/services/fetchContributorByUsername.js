export default async function fetchContributorByUsername(contributorUsername) {
    let response = await fetch(`http://localhost:3005/contributors/${contributorUsername}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        mode: 'cors'
    })

    if (response.ok) {
        let data = await response.json();
        console.log(`Data: ${data}`);
        return data;

    } else {
        // Add error handling
        return;
    }
};

