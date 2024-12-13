const express = require('express');
const axios = require('axios');
const md5 = require('md5');

const app = express();
const PORT = 3000;

// Environment variables
const PARTNER_ID = "116406";
const SECRET_KEY = "8d09fd0b3ae033c72acf6f81efd42273";
const BASE_URL = "https://www.futsell.ru/ffa19/api/pop/";

// Function to calculate the signature
function calculateSignature(id, secretKey, timestamp) {
    return md5(`${id}${secretKey}${timestamp}`);
}

// Function to fetch a player
async function fetchPlayer(minPrice, maxPrice, platform) {
    const ts = Math.floor(Date.now() / 1000);
    const sign = calculateSignature(PARTNER_ID, SECRET_KEY, ts);

    const url = `${BASE_URL}id/${PARTNER_ID}/ts/${ts}/sign/${sign}/sku/${platform}/?min_buy=${minPrice}&max_buy=${maxPrice}`;
    console.log(ts," ",sign," ", platform," ",maxPrice," ",minPrice);

    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching player:', error);
        return { error: "REQUEST_FAILED", message: error.message };
    }
}

// API endpoint
const getplayer = async (req, res) => {
    const { minPrice, maxPrice, platform } = req.query;

    // Validate query parameters
    if (!minPrice || !maxPrice || !platform) {
        return res.status(400).json({ error: "INVALID_REQUEST", message: "minPrice, maxPrice, and platform are required." });
    }

    const result = await fetchPlayer(minPrice, maxPrice, platform);

    if (result.error) {
        return res.status(500).json(result);
    }

    res.json(result);


};



module.exports = {
    getplayer
}

