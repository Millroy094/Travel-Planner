'use strict'


/* import the 'express' module and create an instance. */
const express = require('express')
const app = express()

/* Used to make an instance of basic authentication functionality */
const auth = require('basic-auth')

/* Object that allows to parse the body */
const bodyParser = require('body-parser')

/* lets the app to parse JSON body */
app.use(bodyParser.json())


/* imports my custom module. */
const preferences = require('./modules/preferences.js')
const globals = require('./modules/globals')

/* The port to which my API will be listening on */
const defaultPort = 8080

/* Retrives all preferences to local preferences list */
preferences.initialize()


/* if we receive a GET request for the base URL redirect to /preferences */
app.get('/', function(req, res, next) {
	res.redirect('/preferences', next)
})

/* this route provides a URL for the 'preferences' collection.  */

app.get('/preferences', function(req, res) {
	
	/* gets the host from the request */
	const host = req.headers.host

	/* gets a list of all the preferences */
	const data = preferences.getAll(host)
	
	/* Sends a response to the client */
	res.setHeader('content-type', data.format)
	res.setHeader('Allow', 'GET, POST')
	res.status(data.status).send({message: data.message, data: data.data})
	res.end()

})

/* this route will take preference id as a parameter and respond with JSON representation of journey & weather information */

app.get('/preferences/:preferenceID', function(req, res) {
	
	/* Stores the parameter */
	const preferenceID = req.params.preferenceID
	
	/* if data was returned correctly then send a response, if there was an error client is feedback */

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

/* this route will post preferences into the api database and create a new resource,  it then feedback with a response claiming weather the creation was successful or not */

app.post('/preferences', function(req, res) {

	/* Gets the authentication information and stores it in an object */
	const user = auth(req)

	/* It will either respond with an error if unsucessful else with with the information to the link to the new reasource created */

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

/* This route will update existing resources*/

app.put('/preferences/:preferenceID', function(req, res) {
	
	/* Gets the authentication information and stores it in an object */
	const user = auth(req)

	/* Stores the parameter */
	const preferenceID = req.params.preferenceID


	/* It will either update it or send an error response*/
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

/* This route will delete the specified resource  */
app.delete('/preferences/:preferenceID', function(req, res) {

	/* Gets the authentication information and stores it in an object */
	const user = auth(req)

	/* Stores the parameter */
	const preferenceID = req.params.preferenceID

	/* It will either delete it or send an error response*/
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

