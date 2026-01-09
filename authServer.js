require('dotenv').config();

let database = require('./database');
const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

app.delete('/logout', (req,res) => 
    {
        database.accessTokens = database.accessTokens.filter(token => token !== req.body.token);
        res.json(database.accessTokens);
    }
);
app.put('/refreshToken', (req,res) => 
    {
        
    }
);
app.post('/login', (req,res) => 
    {
        const username = req.body.name;
        const user = {name: username};

        const accessToken = generateAccessToken(user);
        database.accessTokens.push(accessToken);

        res.json(database.accessTokens);
    }
);
function generateAccessToken(user) 
{
    return jwt.sign(user,process.env.ACCESS_TOKEN_SECRET, {expiresIn:'30d'});
}

app.listen(4000);