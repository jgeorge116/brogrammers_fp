var amqp = require("amqplib/callback_api");

module.exports = class SendVerifyEmail {
  sendRequest(username, email, key) {
   console.log('sending request');
    amqp.connect("amqp://admin:password@45.32.7.107", function(err, conn) {
     console.log('connected to rabbit');
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
