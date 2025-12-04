require('dotenv').config();

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
    res.json(posts.filter(post => post.username === req.user.name));
});

function authenticateTokenMiddleware(req,res,next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(token == null) return res.sendStatus(401); //no token

    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET, (err,user) => {
        if(err) return res.sendStatus(403); //no valid (expired) token
        req.user = user;
        next();
    });
}
app.listen(3000);