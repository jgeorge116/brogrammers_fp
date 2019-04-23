const MediaRepository = require("../repositories/mediaRepository");
const MR = new MediaRepository();
const Authentication = require("../utils/authentication");
const JWT = new Authentication();
const formidable = require('formidable');
const fs = require('fs');
const cassandra = require("cassandra-driver");
const fileType = require('file-type');
const uuidv4 = require("uuid/v4");
const client = new cassandra.Client({contactPoints: ['127.0.0.1'],localDataCenter:'datacenter1'});

exports.add_media = async function(req, res) {
    if (!req.headers.authorization && !req.cookies.access_token) {
        res.status(400).send({ status: "error", error: "No token provided" });
    } else {
        if (!req.headers.authorization) {
          var jwt = await JWT.validate(req.cookies.access_token);
        } else {
          var jwt = await JWT.validate(req.headers.authorization);
        }
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
		var query = "INSERT INTO somedia.media (id, contents) VALUES (?,?);"
        	const id = uuidv4();
		var params = [id,contents];
		client.execute(query, params, function(err) {
			if(err) console.log(err);
			else console.log("inserted into media");
		});
                //result = await MR.create(
                //    username,
                //    contents
                //);
		var data = {
			"status":"",
			"id":""
		};
		        if (!username || !contents) {
            	    res.status(400).send({ status: "error", error: "Missing something" });
        	    } else {
		    data["status"] = "OK";
		    data["id"] = id;
		    res.json(data);
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
          res.writeHeader(200,{'Content-Type':fileType(results.rows[0].contents).mime});
          res.write(results.rows[0].contents);
          res.end();
        }
      }
  });
};
