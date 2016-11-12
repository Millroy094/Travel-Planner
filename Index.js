'use strict'


/* import the 'express' module and create an instance. */
const express = require('express')
const app = express()
const auth = require('basic-auth')
var bodyParser = require('body-parser')


app.use(bodyParser.json())


/* import our custom module. */
const preferences = require('./modules/preferences.js')
const globals = require('./modules/globals')

const defaultPort = 8080

/* if we receive a GET request for the base URL redirect to /data */
app.get('/', function(req, res, next) {
	res.redirect('/preferences', next)
})

/* this route provides a URL for the 'data' collection.  */
app.get('/preferences', function(req, res) {
	
	const host = req.headers.host
	const data = preferences.getAll(host)
	console.log(data)
	/* We  send the response code and body. Finally we signal the end of the response. */
	res.setHeader('content-type', data.format)
	res.setHeader('Allow', 'GET, POST')
	res.status(data.status).send({message: data.message, data: data.data})
	res.end()

})

app.get('/preferences/:preferenceID', function(req, res) {
	
	const preferenceID = req.params.preferenceID
	
	preferences.getByID(preferenceID).then((data)=>{

		res.setHeader('content-type', data.format)
		res.setHeader('Allow', 'GET')
		res.status(data.status).send({ message: data.message, data : data.data})
		res.end()

	}).catch((error) => {
		res.setHeader('content-type', error.format)
		res.setHeader('Allow', 'GET')
		res.status(error.status).send({message: error.message})
		res.end()
	})
})

app.post('/preferences', function(req, res) {

	const user = auth(req)

	preferences.addNew(user, req.body).then((data) => {
			
		res.setHeader('content-type', data.format)
		res.setHeader('Allow', 'GET, POST')
		
		if (data.status === globals.status.created) {
			res.setHeader('Location', `/preferences/${data.data.id}`)
			res.setHeader('Last-Modified', data.data.modified.toUTCString())
		}

		if (data.data === undefined) {
			res.status(data.status).send({message: data.message})
			res.end()
		}

		res.status(data.status).send({message: data.message, data: data.data})
		res.end()

	}).catch((error) => {

		res.setHeader('content-type', error.format)
		res.setHeader('Allow', 'GET, POST')
		res.status(error.status).send({message: error.message})
		res.end()

	})

})

/* The PUT method is used to 'update' a named resource. This is not only used to update a named resource that already exists but is also used to create a NEW RESOURCE at the named URL. It's important that you understand how this differs from a POST request. */
app.put('/preferences/:preferenceID', function(req, res) {
	
	const user = auth(req)
	const preferenceID = req.params.preferenceID

	preferences.updateByID(user, req.body, preferenceID).then((data) => {
		
		res.setHeader('content-type', data.format)
		res.setHeader('Allow', 'GET, POST', 'PUT', 'DELETE')
		res.status(data.status).send({message : data.message})
		

	}).catch((error) => {
		
		res.setHeader('content-type', error.format)
		res.setHeader('Allow', 'GET, POST', 'PUT', 'DELETE')
		res.status(error.status).send(error.message)
		

	})

})

/* The DELETE method removes the resource at the specified URL. */
app.delete('/preferences/:preferenceID', function(req, res) {

	const user = auth(req)
	const preferenceID = req.params.preferenceID

	preferences.deleteByID(user, preferenceID).then((data) => {

		res.setHeader('content-type', data.format)
		res.setHeader('Allow', 'GET, POST', 'PUT', 'DELETE')
		res.status(data.status).send({message: data.message})
		res.end()

	}).catch((error)=>{
		res.setHeader('content-type', error.format)
		res.setHeader('Allow', 'GET, POST', 'PUT', 'DELETE')
		res.status(error.status).send({message: error.message})
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

