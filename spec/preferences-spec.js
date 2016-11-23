'use strict'

const preferences = require('../preferences')
const globals = require('../modules/globals')


describe('Integration testing for the preferences model', function() {

	it('Should return an error saying there are no preferences', function (done){

		preferences.initialize().then(()=>{
			done()
		}).catch((error)=>{
			expect(`${error}`).toBe('Error: No preferences found')
			done()
		})
	})

	it('Should create an user', function (done) {

		preferences.addUser({username: 'Millroy', password: '1234566'}).then((data)=>{
			expect(data.message).toEqual('New user added')
			expect(data.status).toEqual(globals.status.created)
			expect(data.format).toEqual(globals.format.json)
			done()
		}).catch((error)=>{
			console.log(error)
			done()
		})

	})


	it('Should return an error saying user already exists', function (done) {

		preferences.addUser({username: 'Millroy', password: '1234566'}).then((data)=>{
			done()
		}).catch((error)=>{
			expect(error.message).toBe('Error: username already exists')
			done()
		})

	})

	it('Should return an error if undefined authorization header is supplied to create a new preference', function(done) {

		const body = {journey: 'Meeting', origin: 'Birmingham', destination: 'Coventry'}
		let auth 

		preferences.addNew(auth, body).then(()=>{
			done()
		}).catch((error)=>{
			expect(error.message).toBe('Error: Authorization head is missing')
			done()
		})

	})



	it('Should return an error if username and password is not supplied, when creating a new preference', function(done) {

		const body = {journey: 'Meeting', origin: 'Birmingham', destination: 'Coventry'}
		const auth  = {basic: {}}

		preferences.addNew(auth, body).then(()=>{
			done()
		}).catch((error)=>{
			expect(error.message).toBe('Error: missing username / password')
			done()
		})

	})

	it('Should return an error if wrong username is supplied, when creating a new preference', function(done) {

		const body = {journey: 'Meeting', origin: 'Birmingham', destination: 'Coventry'}
		const auth  = {basic: {username: 'Millro', password:'1234566'}}

		preferences.addNew(auth, body).then(()=>{
			done()
		}).catch((error)=>{
			expect(error.message).toBe('Error: invalid username')
			done()
		})

	})

	it('Should return an error if the password is wrong, when creating a new preference', function(done) {

		const body = {journey: 'Meeting', origin: 'Birmingham', destination: 'Coventry'}
		const auth = {basic: { username: 'Millroy', password: '12345'}}

		preferences.addNew(auth, body).then(()=>{
			done()
		}).catch((error)=>{
			expect(error.message).toBe('Error: invalid password')
			done()
		})

	})

	it('Should return an error if the origin is not passed, when creating a new preference', function(done) {

		const body = {journey: 'Meeting', destination: 'Coventry'}
		const auth = {basic: { username: 'Millroy', password: '1234566'}}

		preferences.addNew(auth, body).then(()=>{
			done()
		}).catch((error)=>{
			expect(error.message).toBe('JSON data missing in request body')
			done()
		})

	})

	it('Should return an error if the destination is not passed, when creating a new preference', function(done) {

		const body = {journey: 'Meeting', origin: 'Coventry'}
		const auth = {basic: { username: 'Millroy', password: '1234566'}}

		preferences.addNew(auth, body).then(()=>{
			done()
		}).catch((error)=>{
			expect(error.message).toBe('JSON data missing in request body')
			done()
		})

	})

	it('Should return an error if the body is undefined, when creating a new preference', function(done) {

		let body 
		const auth = {basic: { username: 'Millroy', password: '1234566'}}

		preferences.addNew(auth, body).then(()=>{
			done()
		}).catch((error)=>{
			expect(error.message).toBe('JSON data missing in request body')
			done()
		})

	})



	it('Should create a new preference', function(done) {

		const body = {journey: 'Meeting', origin: 'Birmingham', destination: 'Coventry'}
		const auth = {basic: { username: 'Millroy', password: '1234566'}}

		preferences.addNew(auth, body).then((data)=>{
			expect(data.message).toEqual('Preference created')
			expect(data.status).toEqual(globals.status.created)
			expect(data.format).toEqual(globals.format.json)
			expect(data.data.id).toEqual('Meeting')
			expect(data.data.origin).toEqual('Birmingham')
			expect(data.data.destination).toEqual('Coventry')
			done()
		}).catch((error)=>{
			console.log(error)
			done()
		})


	})

	it('Should initialize preferences with data from the database', function (done){

		preferences.initialize().then((data)=>{
			expect(data).toBe(1)
			done()
		}).catch((error)=>{
			console.log(error)
			done()
		})
	})


	it('Should return an error if the preference is already there', function(done) {

		const body = {journey: 'Meeting', origin: 'Birmingham', destination: 'Coventry'}
		const auth = {basic: { username: 'Millroy', password: '1234566'}}

		preferences.addNew(auth, body).then(()=>{
			done()
		}).catch((error)=>{
			expect(error.message).toBe('Journey name already held by another preference')
			done()
		})

	})

	it('Should return weather and direction information', function(done){

		const preference_ID = 'Meeting'

		preferences.getByID(preference_ID).then((data)=>{
			expect(data.data.Origin).toEqual('Birmingham')
			expect(data.data.Destination).toEqual('Coventry')
			expect(data.data.Directions).not.toBe(undefined)
			expect(data.data.Weather).not.toBe(undefined)
			expect(data.status).toEqual(globals.status.ok)
			expect(data.format).toEqual(globals.format.json)
			done()
		}).catch((error)=>{
			console.log(error)
			done()
		})


	})

	it('Should throw an error saying there is no preferences found', function(done){

		const preference_ID = 'Picnic'

		preferences.getByID(preference_ID).then((data)=>{
			done()
		}).catch((error)=>{
			expect(error.message).toBe('Preference not found')
			done()
		})


	})



	it('Should update the Preference', function(done) {

		const body = {origin: 'Birmingham', destination: 'Swindon'}
		const preference_ID = 'Meeting'
		const auth = {basic: { username: 'Millroy', password: '1234566'}}

		preferences.updateByID(auth, body, preference_ID).then((data)=>{

			expect(data.message).toEqual('Preference with the name Meeting is Updated')
			expect(data.status).toEqual(globals.status.ok)
			expect(data.format).toEqual(globals.format.json)
			done()

		}).catch((error)=>{
			console.log(error)
			done()
		})


	})

	it('Should return an error if wrong username is supplied, when updating a preference', function(done) {

		const body = {origin: 'Birmingham', destination: 'Coventry'}
		const auth  = {basic: {username: 'Millro', password:'1234566'}}
		const preference_ID = 'Meeting'

		preferences.updateByID(auth, body, preference_ID).then(()=>{
			done()
		}).catch((error)=>{
			expect(error.message).toBe('Error: invalid username')
			done()
		})

	})

	it('Should return an error when resource is not in collection whilst doing an update', function(done) {

		const body = {origin: 'Birmingham', destination: 'Swindon'}
		const preference_ID = 'Picnic'
		const auth = {basic: { username: 'Millroy', password: '1234566'}}

		preferences.updateByID(auth, body, preference_ID).then((data)=>{
			done()

		}).catch((error)=>{
			expect(error.message).toBe('Preference not in list')
			done()
		})


	})

	it('Should return an error if undefined authorization header is supplied to update a preference', function(done) {

		const body = {origin: 'Birmingham', destination: 'Coventry'}
		let auth
		const preference_ID = 'Meeting' 

		preferences.updateByID(auth, body, preference_ID).then(()=>{
			done()
		}).catch((error)=>{
			expect(error.message).toBe('Error: Authorization head is missing')
			done()
		})

	})

	it('Should return an error if the password is wrong, when updating a preference', function(done) {

		const body = {origin: 'Birmingham', destination: 'Coventry'}
		const auth = {basic: { username: 'Millroy', password: '12345'}}
		const preference_ID = 'Meeting'

		preferences.updateByID(auth, body, preference_ID).then(()=>{
			done()
		}).catch((error)=>{
			expect(error.message).toBe('Error: invalid password')
			done()
		})

	})

	it('Should return an error if username and password is not supplied, when updating a preference', function(done) {

		const body = {origin: 'Birmingham', destination: 'Coventry'}
		const auth  = {basic: {}}
		const preference_ID = 'Meeting'

		preferences.updateByID(auth, body, preference_ID).then(()=>{
			done()
		}).catch((error)=>{
			expect(error.message).toBe('Error: missing username / password')
			done()
		})

	})

	it('Should return an error if the body is undefined, when updating a preference', function(done) {

		let body
		const preference_ID = 'Meeting'
		const auth = {basic: { username: 'Millroy', password: '1234566'}}

		preferences.updateByID(auth, body, preference_ID).then(()=>{
			done()
		}).catch((error)=>{
			expect(error.message).toBe('JSON data missing in request body')
			done()
		})

	})

	it('Should return an error if the origin is not defined, when updating a preference', function(done) {

		const body = {destination: 'Swindon'}
		const preference_ID = 'Meeting'
		const auth = {basic: { username: 'Millroy', password: '1234566'}}

		preferences.updateByID(auth, body, preference_ID).then(()=>{
			done()
		}).catch((error)=>{
			expect(error.message).toBe('JSON data missing in request body')
			done()
		})

	})

	it('Should return an error if the destination is not defined, when updating a preference', function(done) {

		const body = {origin: 'Birmingham'}
		const preference_ID = 'Meeting'
		const auth = {basic: { username: 'Millroy', password: '1234566'}}

		preferences.updateByID(auth, body, preference_ID).then(()=>{
			done()
		}).catch((error)=>{
			expect(error.message).toBe('JSON data missing in request body')
			done()
		})

	})

	it('Should return a list of all the preferences', function(done){

		const host = 'localhost'

		const data = preferences.getAll(host)
		expect(data.message).toEqual('1 preferences found')
		expect(data.status).toEqual(globals.status.ok)
		expect(data.format).toEqual(globals.format.json)
		done()


	})



	it('Should return an error saying preference does not exist', function(done){

		const preference_ID = 'Picnic'

		preferences.getByID(preference_ID).then(()=>{
			done()
		}).catch((error)=>{
			expect(error.message).toEqual('Preference not found')
			done()
		})


	})

	it('Should return an error if undefined authorization header is supplied to delete a preference', function(done) {

		let auth
		const preference_ID = 'Meeting' 

		preferences.deleteByID(auth, preference_ID).then(()=>{
			done()
		}).catch((error)=>{
			expect(error.message).toBe('Error: Authorization head is missing')
			done()
		})

	})

	it('Should return an error if username and password is not supplied, when deleting a preference', function(done) {

		const auth  = {basic: {}}
		const preference_ID = 'Meeting'

		preferences.deleteByID(auth, preference_ID).then(()=>{
			done()
		}).catch((error)=>{
			expect(error.message).toBe('Error: missing username / password')
			done()
		})

	})

	it('Should return an error if wrong username is supplied, when deleting preference', function(done) {

		const auth  = {basic: {username: 'Millro', password:'1234566'}}
		const preference_ID = 'Meeting'

		preferences.deleteByID(auth, preference_ID).then(()=>{
			done()
		}).catch((error)=>{
			expect(error.message).toBe('Error: invalid username')
			done()
		})

	})

	it('Should return an error if the password is wrong, when deleting a preference', function(done) {

		const auth = {basic: { username: 'Millroy', password: '12345'}}
		const preference_ID = 'Meeting'

		preferences.deleteByID(auth, preference_ID).then(()=>{
			done()
		}).catch((error)=>{
			expect(error.message).toBe('Error: invalid password')
			done()
		})

	})

	it('Should delete specified preference', function(done){

		const preference_ID = 'Meeting'
		const auth = {basic: { username: 'Millroy', password: '1234566'}}

		preferences.deleteByID(auth, preference_ID).then((data)=>{

			expect(data.message).toEqual('Preference Meeting is sucessfully deleted')
			expect(data.status).toEqual(globals.status.ok)
			expect(data.format).toEqual(globals.format.json)
			done()

		}).catch((error)=>{
			console.log(error)
			done()
		})

	})


	it('Should return an error when resource is not in collection whilst doing a delete', function(done) {

		
		const preference_ID = 'Picnic'
		const auth = {basic: { username: 'Millroy', password: '1234566'}}

		preferences.deleteByID(auth, preference_ID).then((data)=>{
			done()
		}).catch((error)=>{
			expect(error.message).toBe('Preference not in list')
			done()
		})


	})

	it('Should delete all preferences', function (done) {
		
		preferences.deleteAllPreferences().then((data)=>{
			expect(data).toEqual('All preferences deleted')
			done()
		}).catch((error)=>{
			console.log(error)
			done()
		})
	})

	it('Should delete all users', function (done) {
		
		preferences.deleteAllUsers().then((data)=>{
			expect(data).toEqual('All users deleted')
			done()
		}).catch((error)=>{
			console.log(error)
			done()
		})
	})



})