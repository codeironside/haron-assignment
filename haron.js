const axios = require('axios');
const md5 = require('md5');

const PARTNER_ID = "116406";
const SECRET_KEY = "8d09fd0b3ae033c72acf6f81efd42273";
const BASE_URL = "https://www.futsell.ru/ffa19/api/pop/";

function calculateSignature(id, secretKey, timestamp) {
    return md5(`${id}${secretKey}${timestamp}`);
}

const fetchPlayer = async (req, res) => {
    console.log(req.query)
    // const { minPrice, maxPrice, platform } = req.body;

    // Validate query parameters
    if (!minPrice || !maxPrice || !platform) {
        return res.status(400).json({ error: 'Missing required query parameters: minPrice, maxPrice, platform' });
    }
    const ts = Math.floor(Date.now() / 1000);
    const sign = await calculateSignature(PARTNER_ID, SECRET_KEY, ts.toString());

    const url = `${BASE_URL}id/${PARTNER_ID}/ts/${ts}/sign/${sign}/sku/${platform}/?min_buy=${minPrice}&max_buy=${maxPrice}`;

    try {
        const response = await axios.get(url);
        const data = response.data;

        if (data.error) {
            console.error(`Error: ${data.message}`);
            return null;
        }

        return data.player;
    } catch (error) {
        console.error('Failed to fetch player:', error);
        return null;
    }
}

let counter = 0;
const interval = setInterval(async () => {
    if (counter >= 7200) {
        clearInterval(interval);
    } else {
        const player = await fetchPlayer(1000, 164000, "FFA19PS4");
        if (player) {
            console.log(`Fetched player: ${player.name}, Price: ${player.buyNowPrice}`);
        }
        counter++;
    }
}, 800);

module.exports= {fetchPlayer}