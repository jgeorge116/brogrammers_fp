var amqp = require("amqplib/callback_api");

module.exports = class SendVerifyEmail {
  sendRequest(username, email, key) {
    amqp.connect("amqp://admin:password@192.168.122.35", function(err, conn) {
      conn.createChannel(function(err, ch) {
        var ex = "verify_email";

        ch.assertExchange(ex, "fanout", { durable: true });
        var buffJson = {
          username: username,
          email: email,
          key: key
        };
        ch.publish(ex, "", Buffer.from(JSON.stringify(buffJson)));
      });
      if (err) console.log(err);
      setTimeout(function() {
        conn.close();
        // process.exit(0);
      }, 500);
    });
  }
};
