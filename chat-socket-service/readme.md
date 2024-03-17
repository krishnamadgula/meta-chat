# Chat Socket Service & Chat Listeners

API supported by Chat Socket Service:

Start Chat websocket: GET /chat/:userId

this upgrades the HTTP connection to a WS connection.


The Chat Listener Apps are connected to the Redis queues, and consume messages from channels and persist them by calling the chat management service APIs.


## Tech

Message Queue used: REDIS

`docker run --name local-redis -p 6379:6379  -d redis`


To be able to make calls to the chat management app - configure the ENVVAR `CHAT_MANAGEMENT_SERVICE_URL`

for local set - `export CHAT_MANAGEMENT_SERVICE_URL=http://localhost:3000`

To start the chat socket application run:

`go run main.go`

To start the chat listener app run:

`go run cmd/main.go`
