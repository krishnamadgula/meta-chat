const express = require('express');
const router = express.Router();
const personalMessages = require('../controllers/personalChat');
router.post('/message', personalMessages.addMessageToPersonalChat);
router.post('/message/:messageId/deliver', personalMessages.markMessageDelivered);
router.get('/chat-history/:userId', personalMessages.getPersonalChatHistory);
module.exports = router;
