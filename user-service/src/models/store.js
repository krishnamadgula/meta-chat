const bcrypt = require('bcrypt');
const userSchema = require('./user');

async function createUser(username, password, isAdmin, details) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userSchema({ username:username, password:hashedPassword, isAdmin:isAdmin, details:details});
    await user.save();
    return user;
}

async function login(username, password){
    u = await userSchema.findOne({username});
    if (!u){
        throw new Error('Invalid username or password');
    }

    const isMatch = await bcrypt.compare(password, u.password);
    if (!isMatch) {
        throw new Error('Invalid username or password');
    }

    return u;
}

async function getUsers() {
    return await userSchema.find();
}

async function getUserById(userId) {
    return await userSchema.findById(userId);
}

async function updateUser(username, update) {
    return await userSchema.findOneAndReplace({username}, update, { new: true });
}

async function deleteUser(userId) {
    return await userSchema.findOneAndDelete({username});
}

module.exports = {
    createUser,
    login,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
};