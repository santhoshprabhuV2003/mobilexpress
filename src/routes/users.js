const express = require('express');
const router = express.Router();
const User = require('../models/user');
const eventEmitter = require('../events/events');

router.post('/signup', async (req, res) => {
    try {
        const maxUserID = await User.findOne().sort('-userid');
        const newUserID = maxUserID ? maxUserID.userid + 1 : 1;

        const newUser = new User({
            userid: newUserID,
            username: req.body.username,
            phonenumber: req.body.phoneNumber,
            password: req.body.password
        });
        await newUser.save();

        eventEmitter.emit('userSignedUp', { message: 'User signed up successfully' });

        res.status(201).json({ message: 'Account created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Account creation failed' });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username, password });
        if (user) {
            res.json({ success: true });
        } else {
            res.json({ success: false });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Login failed. Please try again.' });
    }
});

module.exports = router;