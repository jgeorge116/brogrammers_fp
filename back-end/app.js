const express = require('express')
const MongoClient = require('mongodb').MongoClient
const app = express();
const cors = require('cors')
const parser = require('body-parser')
const bcrypt = require('bcryptjs')
const saltRounds = 15

app.use(cors())
app.use(parser.urlencoded({ extended: true }));
app.use(parser.json())

let DBConnection = null; //use DBConnection to add to mongo collections ,set in line below

MongoClient.connect('mongodb://130.245.171.174:27017', { useNewUrlParser: true })
  .then((db) => DBConnection = db.db('stackOverflowDB')).catch((err) => console.log("NOOOOOO",err)) 

app.post('/adduser', (req, res) => {
    bcrypt.hash(req.body.pwd, saltRounds, (err, hash) => {
        if (err) console.log("PASSWORD HASH ERROR", err)
        else {
            const theUser = {
                username: req.body.username, 
                password: hash, 
                email: req.body.email
            }
            DBConnection.collection("users").insertOne(theUser, (DBerr, DBres) => {
                if(DBerr) res.send({status: "error"})
            })
        }
    })
    res.send({status: "OK"})
})

const portNum = process.env.PORT || 4000
app.listen(portNum, () => console.log("Web server listening on port 4000..."))