const MediaRepository = require("../repositories/mediaRepository");
const MR = new MediaRepository();
const Authentication = require("../utils/authentication");
const JWT = new Authentication();
const formidable = require('formidable');
const fs = require('fs');

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
        await new formidable.IncomingForm().parse(req, (err,fields,files) => {
            if(err) throw err
            console.log(files);
            fs.readFile(files.contents.path, function(err,data){
                if(err) throw err;
                contents = data;
                result = await MR.create(
                    username,
                    contents
                );
            });
        });
        if (result.status == "error") {
          res.status(400).send({ status: result.status, error: result.data });
        } else {
          res.send({ status: result.status, id: result.data });
        }
      }
    }
};

exports.get_media_by_id = async function(req, res) {
  var result = await MR.get_media_by_id(req.params.id);
  if (result.status == "error") {
    res.status(400).send({ status: result.status, error: result.data });
  } else {
    res.send({ status: "OK", media: result.data });
  }
};