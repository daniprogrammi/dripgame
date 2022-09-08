import { useEffect, useState} from "react";

async function fetchAllAssets(){
    
    let response = await fetch('http://localhost:3005/assets', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        mode: 'cors'
    })

    if (response.ok) {
        console.log(`EntireResponse: ${JSON.stringify(response)}`);

        let data = await response.json();
        console.log(`Data from res.json(): ${JSON.stringify(data)}`);
        return data;
    }
}

function fetchAssets() {
    return fetch('http://localhost:3005/assets', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(data => data.json());
}


export default function Gallery() {
    let [assets, setassetState] = useState(null);

    useEffect(()=> {
        (async () => {
            let data = await fetchAllAssets();
            setassetState(data);
        }
        )();
    }, [])


    return (
        <div className="gallery">

        </div>
    )

}