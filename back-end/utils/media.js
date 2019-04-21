var amqp = require("amqplib/callback_api");

module.exports = class Media {
    sendAddRequest(id,content) {
        amqp.connect("amqp://localhost", function(err, conn) {
            conn.createChannel(function(err, ch) {
                var ex = "add_media";

                ch.assertExchange(ex, "fanout", { durable: true });
                var buffJson = {
                    id: id,
                    content: content
                };
                ch.publish(ex, "", Buffer.from(JSON.stringify(buffJson)));
                console.log("Send request for add media");
            });
            if (err) console.log(err);
            setTimeout(function() {
                conn.close();
            }, 500);
        });
    }

    async sendGetRequest(id) {
        amqp.connect("amqp://localhost", function(err, conn) {
            conn.createChannel(function(err, ch) {
                var ex = "get_media";

                ch.assertExchange(ex, "fanout", { durable: true });
                var buffJson = {
                    id: id
                };
                ch.publish(ex, "", Buffer.from(JSON.stringify(buffJson)));
                console.log("Send request for get media");
            });
            if (err) console.log(err);
            setTimeout(function() {
                conn.close();
            }, 500);
        });
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
			if(content.results.rows[0].contents)
                            callback(null, content.results.rows[0].contents);
                    }, { noAck: false });
                    });
                });
                if (err) console.log(err);
            });
        };
        var result = await content(function(err,found) {
	    if(err) console.log(err);
            else return found;
        });
	console.log(result);
	return result;
    };
}
