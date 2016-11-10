'use strict'


/* import the 'express' module and create an instance. */
const express = require('express')
const app = express()



/* import our custom module. */
const Integrator = require('./modules/Integrator.js')
const globals = require('./modules/globals')

const status = {
	'ok': 200,
	'created': 201,
	'noContent': 204,
	'notModified': 304,
	'badRequest': 400,
	'unauthorised': 401,
	'notFound': 404
}

const mime = {
	'json': 'application/json',
	'xml': 'application/xml'
}

const defaultPort = 8080

/* if we receive a GET request for the base URL redirect to /data */
app.get('/', function(req, res, next) {
	res.redirect('/data', next)
})

/* this route provides a URL for the 'data' collection.  */
app.get('/data', function(req, res) {
	
	const origin = req.query.origin
	const destination =req.query.destination

	Integrator.getData(origin, destination).then((data)=>{

		/* We  send the response code and body. Finally we signal the end of the response. */
		res.setHeader('content-type', data.format)
		res.setHeader('Allow', 'GET, POST')
		res.status(data.status).send({ message: data.message, data : data.data})
		res.end()

	}).catch((error) => {
		res.setHeader('content-type', error.format)
		res.setHeader('Allow', 'GET, POST')
		res.status(error.status).send({message: error.message})
		res.end()
	})


})


const port = process.env.PORT || defaultPort


app.listen(port, function(err) {
	if (err) {
		console.error(err)
	} else {
		console.log('App is ready at : ' + port)
	}
})

