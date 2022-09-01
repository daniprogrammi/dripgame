const assets = require('../data/assets');
const contributors = require('../data/contributors');

async function main(){
    await assets.getAssetsByCategory('TEST');
    // await assets.createAsset('TEST', 'Dug2', './assets/FTAlBTzUcAAzAyr.jpg', 'dani');
}

main()

