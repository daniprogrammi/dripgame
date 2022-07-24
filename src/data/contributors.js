const mongoCollections = require('../config/mongoCollections');
const assets = mongoCollections.assets;
//const validate = require('./validate'); -- create some validation checks somehow

const { ObjectId } = require('mongodb');

async function getContributors(){
    let assetsDB = await assets();
    let contributors = await assetsDB.find({}, {'contributor': 1});
    return contributors; // list of distinct contributors
}

async function getContributorFiles(contributor){
    let assetsDB = await assets();
    let files = await assetsDB.find({'contributor': contributor}, {'file': 1});
    return files; // list of files
}

module.exports = {
    getContributors,
    getContributorFiles
}