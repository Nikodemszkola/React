require('dotenv').config();

let database = require('./database');
const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

const posts = [
    {
        username: "Kyle",
        title: "Post1"
    },
    {
        username: "Him",
        title: "Post2"
    }
]

app.get('/posts', authenticateTokenMiddleware, (req,res) => {
    verifyAccessToken(req.body.token);
    res.json(posts.filter(post => post.username === req.user.name));
});
app.get('/accesstokens', (req,res) => {
    res.json(database.accessTokens);    
})

function authenticateTokenMiddleware(req,res,next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(token == null) return res.sendStatus(401);
    if(!database.accessTokens.includes(token)) return res.json(database.accessTokens);

    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET, (err,user) => {
        if(err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}
app.listen(3000);