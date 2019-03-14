const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient

MongoClient.connect('mongodb://130.245.171.174:27017/stackOverflowDB', { useNewUrlParser: true })
  .then((db) => console.log("YEEEEEE, CONNECTED!!")).catch((err) => console.log("NOOOOOO",err))
  