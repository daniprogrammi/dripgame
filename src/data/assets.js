const mongoCollections = require('../config/mongoCollections');
const assets = mongoCollections.assets;
//const validate = require('./validate'); -- create some validation checks somehow

const { ObjectId } = require('mongodb');

//TODO: Classes for defining the different types of assets and info associated with them
// Note develop and store files locally for now but def need to move to secure file uploads when live

/**
 *
 * @param {string} assetCategory - Tops, Bottoms, Suits, Shoes, Accessory, Model, 
 * @param {string} assetLabel - Short descriptive name of the item e.g Grey TeddyFresh Hoodie
 * @param {string} contributor - artist to credit with the creation of this asset
 * @param {string} filename - obtained/generated on download
 * @param {object} assetExtra - Object containing any extra data specific to the type of asset given
 */
async function createAsset(assetCategory, assetLabel, assetFile, contributor, assetExtra){
    if (!assetCategory || !assetLabel || !assetFile){
        throw "Error: must provide category, label and FILE";
    }

    let assetsDB = await assets();
    let assetObj = {
        "category": assetCategory,
        "label": assetLabel,
        "file": assetFile,
        "artist": artist,
        "approved": false,
        "published": false
    }

    // TODO: check file dimensions etc?
    // also define the info associated with extras and add checks for those\
    // validate(assetCategory, assetExtra)

    let insertId = await assetsDB.insertOne(assetObj);
    if (insertId) {
        return insertId;
    }
    else {
        throw "Something went wrong on insertion... sorry :(";
    }
}

async function approveAsset(assetId) {
    let assetsDB = await assets();

    let assetApproved = {
        "approved": true
    };

    let updatedObj = await assetsDB.updateOne({'id': assetId}, { $set: assetApproved });
    if (updatedObj['modifiedCount'] !== 1)
        throw `Could not find asset with id: ${assetId}`;

    return;
}

async function getAssetByID(assetId){
    let assetsDB = await assets();
    let asset = await assetsDB.findOne({'id': assetId});
    if (!asset) 
        throw `Error: could not find asset with id: ${assetId}`;

    return asset;
}

async function getAssetsByColor(color){
    let assetsDB = await assets();

    let foundAssets = await assetsDB.find({'color': color});
    if (!foundAssets)
        throw `Error: could not find assets with color: ${color}`;

    return foundAssets;
}

async function getAssetsByCategory(assetCategory){
    let assetsDB = await assets();

    let foundAssets = await assetsDB.find({'category': assetCategory});
    if (!foundAssets)
        throw `Error: could not find assets under category ${assetCategory}`;
    return;
}

async function getAssetByFilename(assetFile) {
    let assetsDB = await assets();
    let asset = await assetsDB.findOne({'file': assetFile});
    if (!!asset) 
        throw `Could not find file ${assetFile}`;
    else
        return asset;
}

module.exports = {
    createAsset,
    approveAsset,
    getAssetByFilename,
    getAssetByID,
    getAssetsByCategory,
    getAssetsByColor
};