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

// Function to introduce a delay
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchPlayer(minPrice, maxPrice, platform) {
    const ts = Math.floor(Date.now() / 1000);
    const sign = calculateSignature(PARTNER_ID, SECRET_KEY, ts);

    const url = `${BASE_URL}id/${PARTNER_ID}/ts/${ts}/sign/${sign}/sku/${platform}/?min_buy=${minPrice}&max_buy=${maxPrice}`;
    console.log(ts, " ", sign, " ", platform, " ", maxPrice, " ", minPrice);

    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching player:', error);
        return { error: "REQUEST_FAILED", message: error.message };
    }
}

async function fetchPlayerIndefinitely(minPrice, maxPrice, platform, onData) {
    const interval = 200; // milliseconds (5 times per second)

    while (true) {
        const result = await fetchPlayer(minPrice, maxPrice, platform);
        onData(result); // Callback to handle the fetched data
        await delay(interval);
    }
}

// API endpoint
const getplayer = async (req, res) => {
    const { minPrice, maxPrice, platform } = req.query;

    // Validate query parameters
    if (!minPrice || !maxPrice || !platform) {
        return res.status(400).json({ error: "INVALID_REQUEST", message: "minPrice, maxPrice, and platform are required." });
    }

    res.json({ message: "Fetching players indefinitely. Check logs for updates." });

    // Start fetching players indefinitely
    fetchPlayerIndefinitely(minPrice, maxPrice, platform, (result) => {
        console.log("Fetched data:", result);
       
    });
};

module.exports = {
    getplayer
};
