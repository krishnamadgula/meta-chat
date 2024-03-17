# Chat Management Service

Implemented/Supported APIs:

Create Group Chat: POST /group-chat

Add Members to a group chat: POST /group-chat/:groupId/member/:memberId

remove member from a group chat: DELETE /group-chat/:groupId/member/:memberId

Add Messages to a group chat history: POST /group-chat/:groupId/message

Add Message to personal chat history: POST /personal-chat/message

Mark Personal Message as Delivered: POST /personal-chat/message/:messageId/deliver

Find all Groups that a user is a part of: GET /group-chat/user-groups/:userId

Get All Groups Chat History: GET /group-chat/chat-history/:userId

Get All Personal Chat History: GET /personal-chat/chat-history/:userId


## Tech

DB used: mongo DB

APP port: 3000
To start the App `node src/index.js`
