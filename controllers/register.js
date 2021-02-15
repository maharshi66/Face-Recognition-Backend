const handleRegister = (req, res, db, bcrypt) => {
    res.header("Access-Control-Allow-Origin", "*");
	const {email, name, password} = req.body;
	if(!email || !name || !password){
		res.status(400).json("Unable to register");
	}
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
}

module.exports = {
	handleRegister: handleRegister
};