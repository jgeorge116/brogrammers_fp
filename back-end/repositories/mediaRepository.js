const Media = require("./../utils/media");
const media = new Media();
const uuidv4 = require("uuid/v4");

module.exports = class MediaRepository {

    /**
     * Creates a media associated with a username
     * @param {String} username 
     * @param {String} content
     */
    async create(username, content) {
        // Check the fields
        if (!username) {
            return {
            status: "error",
            data: "Username is required"
            };
        }
        if (!content) {
            return {
            status: "error",
            data: "Content is required"
            };
        }
        const new_id = uuidv4();
        media.sendAddRequest(new_id,content);
        return {
            status: "OK",
            data: new_id
        };
    }

    /**
     * Get a question associated with an id
     * @param {String} id 
     */
    async get_media_by_id(id) {
        var found_media = await media.sendGetRequest({id: id});
        var content = function(callback) {
            amqp.connect("amqp://localhost", function(err, conn) {
                conn.createChannel(function(err, ch) {
                    var ex = "get_media_results";

                    ch.assertExchange(ex, "fanout", { durable: true });

                    ch.assertQueue("", { exclusive: true }, function(err, q) {
                    console.log(" [*] Waiting for logs. To exit press CTRL+C");
                    ch.bindQueue(q.queue, ex, "");
                    ch.consume(q.queue, function(received) {
                        content = JSON.parse(received.content.toString());
                        if(!content.results.rows[0].contents) {
                            callback(null, content.results.rows[0].contents);
                        }
                    }, { noAck: false });
                    });
                });
                if (err) console.log(err);
            });
        }
        var result = await content(function(err,found) {
	    if(err) console.log(err);
            else return found;
        });
	    if (!result) {
            return {
                status: "error",
                data: "Media does not exist"
            };
        } else {
            return {
                status: "OK",
                data: found_media
            };
        }
    }
}
