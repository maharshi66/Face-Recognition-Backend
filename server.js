/*----------------------------------------------
	Backend Server with Node.js and Express.js
-----------------------------------------------*/
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
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

/*RESTful API Design */

//ROOT ROUTE
app.get("/", (req, res) => {
	res.json("Success!");
});

//SignIn
app.post("/signin", (req, res) => {
	db.select('email', 'hash').from('login')
		.where('email', '=', req.body.email)
		.then(data => {
			const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
			if(isValid){
				return db.select('*').from('users')
					.where('email', '=', req.body.email)
					.then(user => {
						res.json(user[0])
					})
					.catch(err => res.status(400).json("Unable to get user"))
			}else{
				res.status(400).json("Incorrect credentials!");
			}
		})
		.catch(err => res.status(400).json("Unable to get user"));
});

//Register
app.post("/register", (req, res) => {
	const {email, name, password} = req.body;
	const hash = bcrypt.hashSync(password, 10);

	//Add transactions so that we first update the Login table
		//and then the users table
	db.transaction(trx => {
		trx.insert({
			hash: hash,
			email: email
		})
		.into('login')
		.returning('email')
		.then(loginemail => {
			return trx('users')
			.returning('*')
			.insert({
				email: loginemail[0],
				name: name,
				joined: new Date() 
			})
			.then(user => {
				console.log(user[0]);
				res.json(user[0])
			})
		})
		.then(trx.commit)
		.catch(trx.rollback);
	})
	.catch(err => res.status(400).json("Unable to Register!"));
});

//Profile
app.get("/profile/:id", (req, res) => {
	const {id} = req.params;
	db.select('*').from('users').where({id})
		.then(user => {
			if(user.length){
				 res.json(user[0]);
			}else{
				res.status(404).json("User Not Found!");				
			}
		}
	);
});

//Image POST counting # of entries
app.put('/image', (req, res) => {
	const {id} = req.body;
	db('users').where('id', '=', id)
		.increment('entries', 1)
		.returning('entries')
		.then(entries => {
			console.log(entries[0])
			res.json(entries[0]);
		})
		.catch(err => res.status(400).json('Unable to get entries'));

});

app.listen(3000, () => {
	console.log("App running on PORT 3000");
});