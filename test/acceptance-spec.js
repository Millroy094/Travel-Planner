'use strict'

const frisby = require('frisby')
const globals = require('../modules/globals')
const preferences = require('../preferences')

//Clear the database
preferences.deleteAllUsers().then(() => {
}).catch((error) => {
	console.log(error)
})

preferences.deleteAllPreferences().then(() => {
}).catch((error) => {
	console.log(error)
})


/*  // globalSetup defines any settigs used for ALL requests */
frisby.globalSetup({
	request: {
		headers: {'Authorization': 'Basic TWlsbHJveToxMjM0NTY2','Content-Type': 'application/json', 'host': 'localhost'}
	}
})

frisby.create('get a empty list of preferences')
	.get('http://localhost:8080/preferences')
	.expectStatus(globals.status.notFound)
	.expectHeaderContains('Content-Type', globals.format.json)
	.afterJSON( json => {
		expect(json.message).toEqual('no preferences found')
	})
	.toss()


frisby.create('add a new User')
	.post('http://localhost:8080/Users', {'username': 'Millroy', 'password': '1234566'}, {json: true})
	.expectStatus(globals.status.created)
	.expectHeaderContains('Content-Type', globals.format.json)
	.afterJSON( json => {
		expect(json.message).toEqual('New user added')

	})
	.toss()

frisby.create('should throw an error user already exists')
	.post('http://localhost:8080/Users', {'username': 'Millroy', 'password': '1234566'}, {json: true})
	.expectStatus(globals.status.badRequest)
	.expectHeaderContains('Content-Type', globals.format.json)
	.afterJSON( json => {
		expect(json.message).toEqual('Error: username already exists')

	})
	.toss()

frisby.create('add a new preference')
	.post('http://localhost:8080/preferences', {'journey': 'Meeting', 'origin': 'birmingham', 'destination': 'swindon'}, {json: true})
	.expectStatus(globals.status.created)
	.expectHeaderContains('Content-Type', globals.format.json)
	.afterJSON( json => {
		expect(json.message).toEqual('Preference created')
		expect(json.data.id).toEqual('Meeting')
		expect(json.data.origin).toEqual('birmingham')
		expect(json.data.destination).toEqual('swindon')
	})
	.toss()

frisby.create('should throw an error saying preference already exists')
	.post('http://localhost:8080/preferences', {'journey': 'Meeting', 'origin': 'birmingham', 'destination': 'swindon'}, {json: true})
	.expectStatus(globals.status.badRequest)
	.expectHeaderContains('Content-Type', globals.format.json)
	.afterJSON( json => {
		expect(json.message).toEqual('Journey name already held by another preference')
	})
	.toss()

frisby.create('should throw an error saying JSON data missing in request body')
	.post('http://localhost:8080/preferences', {'journey': 'Meeting', 'destination': 'swindon'}, {json: true})
	.expectStatus(globals.status.badRequest)
	.expectHeaderContains('Content-Type', globals.format.json)
	.afterJSON( json => {
		expect(json.message).toEqual('JSON data missing in request body')
	})
	.toss()

frisby.create('should return weather and direction data of preference')
	.get('http://localhost:8080/preferences/Meeting')
	.expectStatus(globals.status.ok)
	.expectHeaderContains('Content-Type', globals.format.json)
	.afterJSON( json => {
		expect(json.data.Origin).toEqual('birmingham')
		expect(json.data.Destination).toEqual('swindon')
		expect(json.data.Directions).not.toBe(undefined)
		expect(json.data.Weather).not.toBe(undefined)
	})
	.toss()

frisby.create('should return an error saying preference not found')
	.get('http://localhost:8080/preferences/Meeting')
	.expectStatus(globals.status.notFound)
	.expectHeaderContains('Content-Type', globals.format.json)
	.afterJSON( json => {
		expect(json.message).toEqual('Preference not found')

	})
	.toss()


frisby.create('update a preference')
	.put('http://localhost:8080/preferences/Meeting', {'origin': 'swindon', 'destination': 'birmingham'}, {json: true})
	.expectStatus(globals.status.ok)
	.expectHeaderContains('Content-Type', globals.format.json)
	.afterJSON( json => {
		expect(json.message).toEqual('Preference with the name Meeting is Updated')
	})

frisby.create('delete a preference')
	.delete('http://localhost:8080/preferences/Meeting')
	.expectStatus(globals.status.ok)
	.expectHeaderContains('Content-Type', globals.format.json)
	.afterJSON( json => {
		expect(json.message).toEqual('Preference Meeting is sucessfully deleted')
	})


//Clear the database
preferences.deleteAllUsers().then(() => {
}).catch((error) => {
	console.log(error)
})

preferences.deleteAllPreferences().then(() => {
}).catch((error) => {
	console.log(error)
})


