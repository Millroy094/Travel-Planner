'use strict'


/* import the 'restify' module and create a server instance. */
const restify = require('restify')
const server = restify.createServer()

/* import the required plugins to parse the body and auth header. */
server.use(restify.fullResponse())
server.use(restify.bodyParser())
server.use(restify.queryParser())
server.use(restify.authorizationParser())


/* imports my custom module. */
const preferences = require('./preferences.js')
const globals = require('./modules/globals')

/* The port to which my API will be listening on */
const defaultPort = 8080

/* Retrives all preferences to local preferences list */
preferences.initialize().then((data) => {
	console.log(` ${data} preferences initialized`)
}).catch((error) => {
	console.log(error)
})


/* if we receive a GET request for the base URL redirect to /preferences */
server.get('/', function(req, res, next) {
	res.redirect('/preferences', next)
})

/* this route provides a URL for the 'preferences' collection.  */

server.get('/preferences', function(req, res) {

	/* gets the host from the request */
	const host = req.headers.host

	/* gets a list of all the preferences */
	const data = preferences.getAll(host)

	/* Sends a response to the client */
	res.setHeader('content-type', data.format)
	res.setHeader('Allow', 'GET, POST')
	res.send(data.status, {message: data.message, data: data.data})
	res.end()

})

/* this route will take preference id as a parameter and respond with JSON representation of journey & weather information */

server.get('/preferences/:preferenceID', function(req, res) {

	/* gets the host from the request */
	const host = req.headers.host

	/* Stores the parameter */
	const preferenceID = req.params.preferenceID

	/* if data was returned correctly then send a response, if there was an error client is feedback */

	preferences.getByID(preferenceID, host).then((data) => {

		res.setHeader('content-type', data.format)
		res.setHeader('Allow', 'GET')
		res.send(data.status, { data: data.data})
		res.end()

	}).catch((error) => {
		res.setHeader('content-type', error.format)
		res.setHeader('Allow', 'GET')
		res.send(error.status, {message: error.message})
		res.end()
	})
})

/* this route will post preferences into the api database and create a new resource,  it then feedback with a response claiming weather the creation was successful or not */

server.post('/preferences', function(req, res) {

	/* gets the host from the request */
	const host = req.headers.host

	/* Gets the authentication information and stores it in an object */
	const auth = req.authorization

	/* It will either respond with an error if unsucessful else with with the information to the link to the new reasource created */

	preferences.addNew(auth, req.body, host).then((data) => {

		res.setHeader('content-type', data.format)
		res.setHeader('Allow', 'GET, POST')

		if (data.status === globals.status.created) {
			res.setHeader('Location', `/preferences/${data.data.id}`)
			res.setHeader('Last-Modified', data.data.preference.modified.toUTCString())
		}

		if (data.data === undefined) {
			res.send(data.status, {message: data.message})
			res.end()
		}

		res.send(data.status, {message: data.message, data: data.data})
		res.end()

	}).catch((error) => {

		res.setHeader('content-type', error.format)
		res.setHeader('Allow', 'GET, POST')
		res.send(error.status, {message: error.message})
		res.end()

	})

})

/* This route will update existing resources*/

server.put('/preferences/:preferenceID', function(req, res) {

	/* Gets the authentication information and stores it in an object */
	const auth = req.authorization

	/* Stores the parameter */
	const preferenceID = req.params.preferenceID


	/* It will either update it or send an error response*/
	preferences.updateByID(auth, req.body, preferenceID).then((data) => {
		res.setHeader('content-type', data.format)
		res.setHeader('Allow', 'GET, POST', 'PUT', 'DELETE')
		res.send(data.status, {message: data.message})


	}).catch((error) => {
		res.setHeader('content-type', error.format)
		res.setHeader('Allow', 'GET, POST', 'PUT', 'DELETE')
		res.send(error.status, {message: error.message})


	})

})

/* This route will delete the specified preference  */
server.del('/preferences/:preferenceID', function(req, res) {

	/* Gets the authentication information and stores it in an object */
	const auth = req.authorization

	/* Stores the parameter */
	const preferenceID = req.params.preferenceID

	/* It will either delete it or send an error response*/
	preferences.deleteByID(auth, preferenceID).then((data) => {

		res.setHeader('content-type', data.format)
		res.setHeader('Allow', 'GET, POST', 'PUT', 'DELETE')
		res.send(data.status, {message: data.message})
		res.end()

	}).catch((error) => {
		res.setHeader('content-type', error.format)
		res.setHeader('Allow', 'GET, POST', 'PUT', 'DELETE')
		res.send(error.status, {message: error.message})
	})


})

/* This route will create a new user  */
server.post('/Users', (req, res) => {

	preferences.addUser(req.body).then((data) => {

		res.setHeader('content-type', data.format)
		res.setHeader('Allow', 'GET, POST')
		res.send(data.status, {message: data.message})
		res.end()

	}).catch((error) => {

		res.setHeader('content-type', error.format)
		res.setHeader('Allow', 'GET, POST')
		res.send(error.status, {message: error.message})
		res.end()
	})
})


/* This return get a port from environment variable or set it to 8080 */

const port = process.env.PORT || defaultPort

/* Listens for connections on the host:port */
server.listen(port, function(err) {
	if (err) {
		console.error(err)
	} else {
		console.log('App is ready at : ' + port)
	}
})

