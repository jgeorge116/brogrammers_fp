const MediaRepository = require("../repositories/mediaRepository");
const MR = new MediaRepository();
const Authentication = require("../utils/authentication");
const JWT = new Authentication();
const formidable = require('formidable');
const fs = require('fs');
const cassandra = require("cassandra-driver");
const client = new cassandra.Client({contactPoints: ['127.0.0.1'],localDataCenter:'datacenter1'});

exports.add_media = async function(req, res) {
    if (!req.headers.authorization) {
        res.status(400).send({ status: "error", error: "No token provided" });
      } else {
        var jwt = await JWT.validate(req.headers.authorization);
        if (!jwt.username) {
          res.clearCookie("access_token", { httpOnly: true });
          res.status(400).send({ status: "error", error: "Invalid JWT" });
        } else {
        const username = jwt.username;
        var result;
        new formidable.IncomingForm().parse(req, (err,fields,files) => {
            if(err) throw err
            fs.readFile(files.content.path, async function(err,data){
                if(err) throw err;
                contents = data;
                result = await MR.create(
                    username,
                    contents
                );
		        if (result.status == "error") {
            	    res.status(400).send({ status: result.status, error: result.data });
        	    } else {
            	    res.send({ status: result.status, id: result.data });
        	    }
            });
        });
      }
    }
};

exports.get_media_by_id = async function(req, res) {
  var query = "SELECT contents FROM somedia.media WHERE id = ?;";
  var params = [req.params.id];
  client.execute(query, params, {prepare:true},  function(err,results) {
      if(err) console.log(err)
      else {
        if(!results.rows[0].contents) {
          res.status(400).send({ status: "error", error: "Media does not exist" });
        } else {
        res.send({ status: "OK", media: results.rows[0].contents });
        }
      }
  });
};
