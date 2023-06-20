// TODO: Pass as object
export default async function createImageReport(reportingUser, reportedImageURL, reportReason, ownerChallenge){
    let response = await fetch(`http://localhost:3005/reports`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify({
            reportingUser: reportingUser,
            reportedImageURL: reportedImageURL,
            reportReason: reportReason,
            ownerChallenge: ownerChallenge
        })
    })

    if (response.ok) {
        let data = await response.json(); // An array containing the data
        return data;
    } else {
        // Add error handling
        return [];
    }
}