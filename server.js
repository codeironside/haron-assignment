require("dotenv").config();
const express = require("express");


const cors = require("cors");


const app = express();


const port = process.env.PORT||4000;



// app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//authorizations endpoint
app.set('trust proxy', true);
app.use((req, res, next) => {
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    // Add the 'Authorization' header to the list of exposed headers
    res.append('Access-Control-Expose-Headers', 'Authorization');
    next();
});
// Your routes go here
app.get('/', (req, res) => {
    res.send('finished api');
});
// Routes
app.use("/api", require("./route"));



app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});