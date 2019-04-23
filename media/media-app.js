const amqp = require("amqplib/callback_api");
const cassandra = require("cassandra-driver");
const client = new cassandra.Client({contactPoints: ['127.0.0.1'],localDataCenter:'datacenter1'});

client.connect(function(err,result){
    if(err) console.log(err);
    else console.log('cassandra connected');
});

var query = "CREATE KEYSPACE IF NOT EXISTS somedia WITH replication = {\'class\': \'NetworkTopologyStrategy\', \'datacenter1\' : \'1\' }";
client.execute(query, function(err){
    if(err) console.log(err);
    else console.log('created keyspace somedia');
});

var query = "CREATE TABLE IF NOT EXISTS somedia.media (id UUID PRIMARY KEY, contents blob)";
client.execute(query, function(err){
    if(err) console.log(err);
    else console.log('created table media');
});

/**
 * Adds the media
 * @param {JSON} mediaInfo 
 */
function add_media(mediaInfo) {
    var query = "INSERT INTO somedia.media (id, contents) VALUES (?,?);";
    console.log("INSERTING", mediaInfo.content.data);
    params = [mediaInfo.id, mediaInfo.content.data];
    client.execute(query, params, function(err) {
        if(err) console.log(err)
        else console.log('inserted into media');
	client.execute("SELECT contents FROM somedia.media WHERE id=?", [mediaInfo.id], function(err, data) {
		console.log(data);
	});
    });
}

// /**
//  * Gets the media
//  * @param {JSON} mediaInfo 
//  */
// function get_media(mediaInfo) {
//     var query = "SELECT contents FROM somedia.media WHERE id = ?;";
//     client.execute(query, mediaInfo.id, function(err,results) {
//         if(err) console.log(err)
//         else {
//             amqp.connect("amqp://localhost", function(err, conn) {
//                 conn.createChannel(function(err, ch) {
//                     var ex = "get_media_results";

//                     ch.assertExchange(ex, "fanout", { durable: true });
//                     var buffJson = {
//                         results: results
//                     };
//                     ch.publish(ex, "get_media_queue", Buffer.from(JSON.stringify(buffJson)));
//                     console.log("Send results for get media");
//                 });
//                 if (err) console.log(err);
//                 setTimeout(function() {
//                     conn.close();
//                 }, 500);
//             });
//         }
//     });
// }

amqp.connect("amqp://localhost", function(err, conn) {
  conn.createChannel(function(err, ch) {
    if(err) console.log(err)
    var ex = "add_media";

    ch.assertExchange(ex, "fanout", { durable: true });

    ch.assertQueue("", { exclusive: true }, function(err, q) {
      console.log(" [*] Waiting for logs. To exit press CTRL+C");
      ch.bindQueue(q.queue, ex, "");
      ch.consume(q.queue, function(received) {
          content = JSON.parse(received.content.toString());
          add_media(content);
        },{ noAck: false });
    });

    var ex1 = "get_media";

    ch.assertExchange(ex1, "fanout", { durable: true });

    ch.assertQueue("", { exclusive: true }, function(err, q) {
      console.log(" [*] Waiting for logs. To exit press CTRL+C");
      ch.bindQueue(q.queue, ex1, "");
      ch.consume(q.queue, function(received) {
          content = JSON.parse(received.content.toString());
          get_media(content);
        },{ noAck: false });
    });
  });
});
