/*----------------------------------------------
	Backend Server with Node.js and Express.js
-----------------------------------------------*/

const express = require('express');
const app = express();

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
	res.send("This is working");
})



app.listen(3000, () => {
	console.log("App running on PORT 3000");
});