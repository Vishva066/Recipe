const express = require('express');

const path = require('path')

// const session = require('express-session');

const loginroute = express.Router()

const auth = require('../middleware/auth')

const users = {};

loginroute.use(express.json());

loginroute.use(express.urlencoded({extended: false}));

loginroute.use(express.static(path.join(__dirname, '../../public')));

loginroute.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/static', 'signup.html'))
})

loginroute.post('/signup', (req,res) => {
        const { username, email, password } = req.body;
        console.log(req.body);
        console.log(username)
        if (users[username]) {
            res.send('User already exists. Please login.');
        } else {
            users[username] = {email: email, password: password, favourites: []};
            req.session.username = username;
            req.session.favourites = users[username].favourites;
            console.log(req.session.favourites)
            res.redirect('/home');
        }
})

loginroute.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/static', 'login.html'))
})

loginroute.post('/login', (req, res) => {
    const { username, password } = req.body;
    console.log(users)
    if (users[username].password === password) {
        req.session.username = username;
        req.session.favourites = users[username].favourites
        res.redirect('/home');
    } else {
        res.send('Invalid username or password. Please signup.');
    }
})

loginroute.post('/add/favourites', auth, (req, res) => {
    const { title, image, recipeId } = req.body;
    console.log(req.body);
    
    const username = req.session.username;

    const user = users[username];

    
        // Add the new favorite recipe to the session
        user.favourites.push({ title, image, recipeId });
        res.json({ message: 'Recipe added to favorites' });
})

loginroute.get('/api/favourite', (req, res) => {
    const username = req.session.username;

    const favourite = users[username].favourites

    res.json(favourite);
})

loginroute.post('/logout', (req,res) => {
        req.session.destroy(); // Destroy session
        res.redirect('/');
})

module.exports = loginroute;