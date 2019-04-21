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
    };
}
