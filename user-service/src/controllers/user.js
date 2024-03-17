const User = require('../models/store');
const jwt = require('jsonwebtoken');

exports.getAllUsers = async (req, res) => {
    try{
        users = await User.getUsers();
        res.status(200).json(users);
    }catch (err){
        res.status(400).json({ message: err.message });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try{
        u = await User.login(username, password);
        const token = jwt.sign({ username }, "JWT_SECRET", { expiresIn: '1h' });
        res.json({token})
    }catch (err){
        return res.status(401).json({ message: 'Invalid Username / Password' });
    }
};

exports.createUser = async (req, res) => {
    try {
        const { username, password, isAdmin, details } = req.body;
        const newUser = await User.createUser(username, password, isAdmin, details);
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


exports.updateUser = async (req, res) => {
    try {
        const username = req.params.username
        if (username != req.user.username){
            res.status(403).json({ message: "unauthorized" });
            return;
        }

         const u = await User.updateUser(username, req.body);
         res.status(200).json(u);
     } catch (err) {
         res.status(400).json({ message: err.message });
     }
};

exports.deleteUser = async(req, res) => {
    try {
        const uname = req.params.username
        if (uname != req.user){
            res.status(403).json({ message: "unauthorized" });
            return;
        }
         const u = await User.deleteUser(uname);
         res.status(204).json(u);
     } catch (err) {
         res.status(400).json({ message: err.message });
     }
};