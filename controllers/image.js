const handleImageCounter = (req, res, db) =>{
	const {id} = req.body;
	db('users').where('id', '=', id)
		.increment('entries', 1)
		.returning('entries')
		.then(entries => {
			console.log(entries[0])
			res.json(entries[0]);
		})
		.catch(err => res.status(400).json('Unable to get entries'));
}

module.exports = {
	handleImageCounter: handleImageCounter
}