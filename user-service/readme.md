# User Service

Supported APIs:

Create user: POST /users

User Login (returns JWT): POST /login

Get All Users (expects Bearer token header): GET /users

Update User by username (expects Bearer token header): PUT /users/:username

DELETE User by username (expects Bearer token header): DELETE /users/:username

## Tech

DB used: mongodb
 `docker run --name local-mongo -d -p 27017:27017  mongo`


APP port: 3001
To start the App `node src/index.js`
