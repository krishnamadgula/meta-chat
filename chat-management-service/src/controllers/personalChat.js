const personalChat = require('../models/store');

exports.addMessageToPersonalChat= async (req, res) =>{
    const {receiverId,senderId,message} = req.body;
    try{
        g = await personalChat.addMessageToPersonalChat(message,receiverId, senderId)
        res.status(200).json(g)
    }catch (err){
        res.status(400).json({message: err.message})
    }
}

exports.markMessageDelivered = async (req, res) =>{
    const messageId = req.params.messageId
    try{
        g = await personalChat.markMessageDelivered(messageId)
        res.status(200).json(g)
    }catch (err){
        res.status(400).json({message: err.message})
    }
}

exports.getPersonalChatHistory= async (req, res) =>{
    const userId = req.params.userId
    try{
        g = await personalChat.getPersonalChatHistory(userId)
        res.status(200).json(g)
    }catch (err){
        res.status(400).json({message: err.message})
    }
}