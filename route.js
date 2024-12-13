const express = require("express");
// const { fetchPlayer } = require("./haron");
const { getplayer } = require("./harom");
const Router = express.Router();



//access private
Router.route("/fetchPlayer").get(getplayer);

module.exports = Router;