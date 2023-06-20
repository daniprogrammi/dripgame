export default async function fetchReportsByUser(reportingUser){
    let reportingUserParam = new URLSearchParams({reportingUser: reportingUser});
    let response = await fetch(`http://localhost:3005/reports/${reportingUserParam}`, {
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
}