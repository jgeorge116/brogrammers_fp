const MediaRepository = require("../repositories/mediaRepository");
const MR = new MediaRepository();
const Authentication = require("../utils/authentication");
const JWT = new Authentication();
const formidable = require("formidable");
const fs = require("fs");
const cassandra = require("cassandra-driver");
const fileType = require("file-type");
const uuidv4 = require("uuid/v4");
const mmm = require('mmmagic');
const Magic = mmm.Magic;
const magic = new Magic(mmm.MAGIC_MIME_TYPE);
const client = new cassandra.Client({
  contactPoints: ["130.245.171.138", "130.245.171.191"], //, "192.168.122.49"],
//   contactPoints: ["127.0.0.1"],
  localDataCenter: "datacenter1",
  readTimeout: 0
});

exports.add_media = async function(req, res) {
  if (!req.headers.authorization && !req.cookies.access_token) {
    console.log("No token provided");
    res.status(400).send({ status: "error", error: "No token provided" });
    return;
  } else {
    if (!req.headers.authorization) {
      var jwt = await JWT.validate(req.cookies.access_token);
    } else {
      var jwt = await JWT.validate(req.headers.authorization);
    }
    if (!jwt.username) {
      res.clearCookie("access_token");
      res.status(400).send({ status: "error", error: "Invalid JWT" });
    } else {
      const username = jwt.username;
      //console.log(req.headers);
      if (!username) {
        console.log("Missing username");
        res.status(400).send({ status: "error", error: "Missing something" });
      }
      new formidable.IncomingForm().parse(req, (err, fields, files) => {
        if (err) {
          console.log(err);
          res
            .status(400)
            .send({ status: "error", error: "Error parsing file" });
          return;
        }
        if (!files.content) {
          res.status(400).send({ status: "error", error: "No file provided" });
          return;
        }
        fs.readFile(files.content.path, async function(err, data) {
          if (err) {
            console.log(err);
            res
              .status(400)
              .send({ status: "error", error: "Error reading file" });
            return;
          }
          contents = data;
          var query =
            "INSERT INTO somedia.media (id, contents, username) VALUES (?,?,?);";
          const id = uuidv4()
            .toString()
            .replace(/\-/g, "");
          console.log(id);
          var params = [id, contents, username];
          await client.execute(query, params, function(err) {
            if (err) console.log(err);
            else {
              //console.log("inserted into media");
              var data = {
                status: "",
                id: ""
              };
              if (!contents) {
                //console.log("Missing buffer value");
                res
                  .status(400)
                  .send({ status: "error", error: "Missing buffer value" });
              } else {
                data["status"] = "OK";
                data["id"] = id;
                //console.log(data);
                res.status(200).send(data);
              }
            }
          });
          //result = await MR.create(
          //    username,
          //    contents
          //);
        });
      });
    }
  }
};

exports.get_media_by_id = function(req, res) {
  var query = "SELECT contents FROM somedia.media WHERE id = ?;";
  var params = [req.params.id];
  client.execute(query, params, { prepare: true }, function(err, results) {
    if (err) {
      console.log(err);
      res
        .status(400)
        .send({ status: "error", error: "Media does not exist" })
        .end();
    } else {
      if (!results.rows[0]) {
        res
          .status(400)
          .send({ status: "error", error: "Media does not exist" })
          .end();
      } else {
        var mime = magic.detect(Buffer.from(results.rows[0].contents) , function(err, result) {
          if (err) console.log(err);
          //console.log(result);
          res.setHeader("Content-Type", result);
          res.setHeader("Content-Length", results.rows[0].contents.length);
          res.status(200).send(results.rows[0].contents);
        });
        //res.setHeader('Content-Type', mime);
        //console.log(fileType(results.rows[0].contents));
        //res.setHeader("Content-Type", fileType(results.rows[0].contents).mime);
        //res.setHeader("Content-Length", results.rows[0].contents.length);
        //res.writeHeader(200, {
        //  "Content-Type": fileType(results.rows[0].contents).mime,
        //  "Content-Length": results.rows[0].contents.length
        //});
        //res.status(200).send(results.rows[0].contents);
      }
    }
  });
};
