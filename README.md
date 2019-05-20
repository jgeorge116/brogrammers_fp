# StackOverflow Clone 
## Tools
:information_desk_person: Apache Cassandra 

:blowfish: ElasticSearch 

:bullettrain_front: Express.js 

:leaves: MongoDB

:bus: Nginx

:email: PostFix

:rabbit: RabbitMQ 

:open_mouth: React.JS 
## Set Up 
You must have an instance of Cassandra, MongoDB, PostFix, RabbitMQ, and ElasticSearch running on separate instances. How many instances is up to how many requests are required to be handled at any given time.

To set up the Express/React apps, on both the back-end and front-end folders `npm install`. The front-end will be listening on port 3000 and back-end will be listening on port 4000.

Use Nginx to route requests to the appropriate instance.
