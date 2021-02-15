/*----------------------------------------------
	Backend Server with Node.js and Express.js
-----------------------------------------------*/
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');

//For Database Connection
const db = knex({
 client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'maharshi',
    password : 'Mouse1996',
    database : 'facerecognition'
  }
});

console.log(db.select('*').from('users').then(data => console.log));
//Middleware
app.use(bodyParser.json());
app.use(cors());

//ROUTES
app.get("/", (req, res) => {res.json("Success!")});
app.post('/signin', (req, res) => {signin.handleSignIn(req, res, db, bcrypt)});
app.post("/register", (req, res) => {register.handleRegister(req, res, db, bcrypt)}); 
app.get("/profile/:id", (req, res) => {profile.handleProfileGet(req, res, db)});
app.put('/image', (req, res) => {image.handleImageCounter(req, res, db)});
app.post('/imageUrl', (req, res) => {image.handleApiCall(req, res)});
app.listen(3000, () => {
	console.log("App running on PORT 3000");
});