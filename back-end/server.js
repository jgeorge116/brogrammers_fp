const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient

MongoClient.connect('mongodb://130.245.171.174:27017/test', { useNewUrlParser: true })
  .then(function (db){
    console.log("YEEEEEE, CONNECTED!!")
  }).catch(function (err){console.log("NOOOOOO",err)})

  /*
    * made db on an open stack instance
    * connection doesn't work yet, even tho i added the the rule, enabled mongo on the firewall, and changed the config file
    * ip is: 130.245.171.174
    * I think the string isn't formatted correctly cuz for remote dbs, it's formatted like..
    * mongodb://[username]:[password]@[host]:[port]/[database]
    * too lazy to fix now lmaoo
  */