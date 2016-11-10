'use strict'


/* import the 'restify' module and create an instance. */
const restify = require('restify')
const server = restify.createServer()


/* import the required plugins to parse the body and auth header. */
server.use(restify.fullResponse())
server.use(restify.bodyParser())
server.use(restify.authorizationParser())

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
server.get('/', function(req, res, next) {
	res.redirect('/data', next)
})

/* this route provides a URL for the 'data' collection.  */
server.get('/data', function(req, res) {
	
	Integrator.getData(origin, destination).then((data)=>{

		/* We  send the response code and body. Finally we signal the end of the response. */
		res.setHeader('content-type', data.format)
		res.setHeader('Allow', 'GET, POST')
		res.json(data.status, {message: data.message, data: data.data})

	}).catch((error) => {
		console.log(error)
	})


})




/* const tripPlannerApi = require('./modules/integrator')

const origin = String(readline.question('start address: ')).trim()
const destination = String(readline.question('Destination address: ')).trim()


tripPlannerApi.getData(origin, destination).then((result)=>{

	console.log(result)

}).catch((error) => {
	console.log(error)
})



console.log('EOF')

*/