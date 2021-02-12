/*----------------------------------------------
	Backend Server with Node.js and Express.js
-----------------------------------------------*/
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
//Middleware
app.use(bodyParser.json());
app.use(cors());

const database = {
	users: 
	[
		{
			id: "123",
			name: "John",
			email: "john@mock.com",
			password: "cookies",
			entries: 0,
			date: new Date()
		},

		{
			id: "124",
			name: "Sally",
			email: "sally@mock.com",
			password: "cookies2",
			entries: 0,
			date: new Date()
		}
	]
};
/*
	RESTful API Design 
	/ ---> res = this is working
	/signin ---> POST = success/fail
	/register ---> POST = user
	/profile/:userId ---> GET = user
	/image ---> PUT ---> user  
*/

//ROOT ROUTE
app.get("/", (req, res) => {
	res.json(database.users);
});

//SignIn
app.post("/signin", (req, res) => {
	if(req.body.email === database.users[0].email 
		&& req.body.password === database.users[0].password){
		console.log(req.body);
		res.json("Success");
	}else{
		res.status(400).json("Error Logging In!");
	}
});

//Register
app.post("/register", (req, res) => {
	const {email, name, password} = req.body;
	database.users.push({
		id: "131",
		name: name,
		email: email,
		password: password,
		entries: 0,
		joined: new Date()
	});
	console.log(database.users[database.users.length - 1]);
	res.json(database.users[database.users.length - 1]);
});

//Profile
app.get("/profile/:id", (req, res) => {
	const {id} = req.params;
	var found = false;
	database.users.forEach(user => {
		if(user.id === id){
			found = true;
			return res.json(user);
		}
	});

	if(!found){
		res.status(404).json("No Such User!");	
	} 
});

//Image POST counting # of entries
app.put('/image', (req, res) => {
	const {id} = req.body;
	var found = false;
	database.users.forEach(user => {
		if(user.id === id){
			found = true;
			user.entries++;
			return res.json(user.entries);
		}
	});

	if(!found){
		res.status(400).json("No Such User!");	
	} 
});

app.listen(3000, () => {
	console.log("App running on PORT 3000");
});