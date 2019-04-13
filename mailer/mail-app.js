var amqp = require("amqplib/callback_api");
var nodemailer = require("nodemailer");
/**
 * Sends a verification email
 * @param {JSON} verifyInfo 
 */
function send_verification(verifyInfo) {
  let trans = nodemailer.createTransport({
    port: 25,
    host: "localhost",
    tls: {
      rejectUnauthorized: false
    }
  });
  let opt = {
    from: "no-reply@brogrammers.cse356.compas.cs.stonybrook.edu",
    to: verifyInfo.email,
    subject: "StackOverflow: Verify Account",
    text: `${
      verifyInfo.username
    }, Please enter the following key (without the brackets): <${
      verifyInfo.key
    }>`
  };

  trans.sendMail(opt, (error, info) => {
    if (error) console.log(error);
    if (info) {
      console.log("Message sent: %s", info.messageId);
    }
  });
  return { status: "OK", data: "" };
}

amqp.connect("amqp://localhost", function(err, conn) {
  conn.createChannel(function(err, ch) {
    var ex = "verify_email";

    ch.assertExchange(ex, "fanout", { durable: true });

    ch.assertQueue("", { exclusive: true }, function(err, q) {
      console.log(" [*] Waiting for logs. To exit press CTRL+C");
      ch.bindQueue(q.queue, ex, "");
      //   args.forEach(function(severity) {
      //     ch.bindQueue(q.queue, ex, severity);
      //   });
      ch.consume(
        q.queue,
        function(received) {
          content = JSON.parse(received.content.toString());
          send_verification(content);
        },
        { noAck: false }
      );
    });
  });
});
