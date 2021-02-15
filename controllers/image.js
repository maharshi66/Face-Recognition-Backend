const Clarifai = require('clarifai');
const app = new Clarifai.App({
	apiKey: '5f7b23d0cd6847f9b3665f83a334a126'
});
const handleApiCall = (req, res) => {

    app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
    	res.json(data);
    })
    .catch(err => res.status(400).json("Unable to fetch API"));
}

const handleImageCounter = (req, res, db) => {
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
	handleImageCounter: handleImageCounter,
	handleApiCall: handleApiCall
}