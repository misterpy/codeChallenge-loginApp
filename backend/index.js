const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const DB_PORT = 3000;
const BCRYPT_SALT = bcrypt.genSaltSync(10);
const TOKEN_SECRET = 'This should have been something very secret in another file.';

const app = express();
app.use(cors());
app.use(express.json());

let dbo;
const mongoClient = require('mongodb').MongoClient;
mongoClient.connect('mongodb://mongo:27017/saanaLoginAppDB', { useUnifiedTopology: true }, function(err, db) {
    if (!!err) throw err;
    dbo = db.db('saanaLoginAppDB');

    console.log('Connection to DB initialized!');

    app.listen(DB_PORT, () => {
        console.log(`Login API listening at http://localhost:${DB_PORT}`);
    });
});

app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.post('/register', async (req, res) => {
    const {password, name, email} = req.body;

    const users = await dbo.collection('users').find({email});
    const user = await users.next();

    if (!!user) {
        return res.sendStatus(400);
    }

    const hashedPassword = await bcrypt.hashSync(password, BCRYPT_SALT);

    await dbo.collection('users').insertOne({
        password: hashedPassword,
        email,
        name,
    });

    res.send(true);
});

app.post('/login', async (req, res) => {
    const {password, email} = req.body;

    const users = await dbo.collection('users').find({email});
    const user = await users.next();
    if (!user) {
        return res.sendStatus(400);
    }

    if (!await bcrypt.compareSync(password, user.password || '')) {
        return res.sendStatus(400);
    }

    const accessToken = generateAccessToken(user);
    return res.json({
        token: accessToken,
        user,
    });
});

app.post('/authenticate', [authenticateToken], async (req, res) => {
    return res.json({
        token: req.token,
        user: req.user,
    });
});

function generateAccessToken(user) {
    return jwt.sign(user, TOKEN_SECRET);
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    jwt.verify(token, TOKEN_SECRET, (err, user) => {
        if (!!err) {
            console.log(err);
            return res.sendStatus(403);
        }

        req.token = token;
        req.user = user;
        next();
    });
}
