const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const userRoute = require('./routes/users');
const apiSource = '/api/v1';
const databseUrl = 'mongodb://localhost:27017/artGallery';

mongoose.connect(databseUrl, {
	useNewUrlParser: true
});

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json());

// setting headers
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
	if (req.method === 'OPTIONS') {
		res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
		return res.status(200).json({});
	}
	next();
})

app.use(apiSource + '/users', userRoute);

/* Error Handling */
app.use((req, res, next) => {
	console.log('error message');
	const error = new Error('Not Found');
	error.status = 404;
	next(error);
})
app.use((error, req, res, next) => {
	res.status(error.status || 500).json({
		error: {
			global: error.message
		}
	})
})

module.exports = app;