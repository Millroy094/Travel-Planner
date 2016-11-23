'use strict'

const frisby = require('frisby')
const globals = require('../modules/globals')


/*  // globalSetup defines any settigs used for ALL requests */
frisby.globalSetup({
	request: {
		headers: {'Authorization': 'Basic dGVzdHVzZXI6cDQ1NXcwcmQ=','Content-Type': 'application/json', 'host': 'localhost'}
	}
})

frisby.create('get a empty list of preferences')
	.get('http://localhost:8080/preferences')
	.expectStatus(globals.status.notFound)
	.expectHeaderContains('Content-Type', globals.format.json)
	.afterJSON( json => {
		expect(json.message).toEqual('Preference not found')
	})
	.toss()
