const groups = require('../models/store');

exports.createGroup = async (req, res) =>{
    const {groupName, userId} = req.body;
    try{
        g = await groups.createGroup(groupName, userId)
        res.status(201).json(g)
    }catch (err){
        res.status(400).json({message: err.message})
    }
}

exports.addMemberToGroup = async (req, res) =>{
    const groupId = req.params.groupId
    const memberId = req.params.memberId

    try{
        g = await groups.addMemberToGroup(groupId, memberId)
        res.status(200).json(g)
    }catch (err){
        res.status(400).json({message: err.message})
    }
}

exports.removeMemberFromGroup= async (req, res) =>{
    const groupId = req.params.groupId
    const memberId = req.params.memberId
    
    try{
        g = await groups.removeMemberFromGroup(groupId, memberId)
        res.status(200).json(g)
    }catch (err){
        res.status(400).json({message: err.message})
    }
}


exports.addMessageToGroupChat = async (req, res) =>{
    const groupId = req.params.groupId;
    const {senderId,message} = req.body;
    try{
        g = await groups.addMessageToGroupChat(groupId,senderId,message)
        res.status(200).json(g)
    }catch (err){
        res.status(400).json({message: err.message})
    }
}

exports.getGroupChatHistory= async (req, res) =>{
    const userId = req.params.userId
    try{
        g = await groups.getGroupChatHistory(userId)
        res.status(200).json(g)
    }catch (err){
        res.status(400).json({message: err.message})
    }
}

exports.getUserGroups = async (req, res) =>{
    const userId = req.params.userId
    try{
        g = await groups.getUserGroups(userId)
        res.status(200).json(g)
    }catch (err){
        res.status(400).json({message: err.message})
    }
}