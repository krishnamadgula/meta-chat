const groups = require('./groups');
const userGroups = require('./userGroups');
const groupMessages = require('./groupMessages');
const personalMessages= require('./personalMessages');

async function createGroup(groupName, userId){
    const group = await groups.create({name:groupName, users:[userId]});
    const userGroup = await userGroups.findOneAndUpdate(
        {userId},
        { $push: { groups: group._id } },
        { new: true, upsert: true } // Return the updated document after update
    );

    return group;
}

async function addMemberToGroup(groupId, userId){
    const group = await groups.findByIdAndUpdate(
        groupId,
        { $push: { users: userId } },
        { new: true, upsert:true } // Return the updated document after update
    );

    const userGroup = await userGroups.findOneAndUpdate(
        {userId},
        { $push: { groups: groupId } },
        { new: true, upsert: true} // Return the updated document after update
    );

    console.log(userGroup);
    return group;
}

async function removeMemberFromGroup(groupId, userId){
    group =   await groups.findByIdAndUpdate(
        groupId,
        { $pull: { users: userId } },
        { new: true , upsert:true} // Return the updated document after update
    );

    const userGroup = await userGroups.findOneAndUpdate(
        {userId},
        { $pull: { groups: groupId } },
        { new: true } // Return the updated document after update
    );
    return group;

}

async function addMessageToPersonalChat(message,receiverId, senderId){
    return await personalMessages.create({
        receiverId:receiverId,
        senderId: senderId,
        content:message,
        sentTime:Date.now(),
    })
}

async function markMessageDelivered(messageId){
    return await personalMessages.findByIdAndUpdate(messageId, {["deliveredTime"]:Date.now()}, {new:true})
}

async function addMessageToGroupChat(groupId,senderId,message){
    return await groupMessages.create({
        groupId:groupId,
        senderId: senderId,
        content:message,
        sentTime:Date.now(),
    })
}

async function getGroupChatHistory(userId){
    g = await userGroups.find({userId})
    const gs = g.map(group => group.groups)
    let groupIDs = [];
    
    gs.forEach(group => {
        group.forEach(gid =>{
            groupIDs.push(gid);
        })
    })
    
    console.log(groupIDs)
    return await groupMessages.find({groupId: {$in:groupIDs}}).sort({ sentTime: -1 })
}

async function getPersonalChatHistory(userId){
    return await personalMessages.find({$or: [
        {senderId: userId},
        {receiver_id: userId},
    ]}).sort({ sentTime: -1 })
}


async function getUserGroups(userId){
    const ugs =  await userGroups.find({userId})
    const gs = ugs.map(group => group.groups)
    let groupIDs = [];
    
    gs.forEach(group => {
        group.forEach(gid =>{
            groupIDs.push(gid);
        })
    })

    return groupIDs;
}
module.exports = {
    createGroup,
    addMemberToGroup,
    removeMemberFromGroup,
    addMessageToPersonalChat,
    markMessageDelivered,
    addMessageToGroupChat,
    getGroupChatHistory,
    getPersonalChatHistory,
    getUserGroups,
}