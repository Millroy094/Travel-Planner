'use strict'

const preferences = require('./preferences')
const globals = require('./modules/globals')


describe('Integration testing for the preferences model', function() {



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

	it('Should return a list of all the preferences', function(done){

		const host = 'localhost'

		const data = preferences.getAll(host)
		expect(data.message).toEqual('1 preferences found')
		expect(data.status).toEqual(globals.status.ok)
		expect(data.format).toEqual(globals.format.json)
		done()


	})

	it('Should return weather and direction information', function(done){

		const preference_ID = 'Meeting'

		preferences.getByID(preference_ID).then((data)=>{
			expect(data.data.Origin).toEqual('Birmingham')
			expect(data.data.Directions).not.ToEqual(undefined)
			expect(data.data.Weather).not.toEqual(undefined)
			expect(data.status).toEqual(globals.status.ok)
			expect(data.format).toEqual(globals.format.json)
			done()
		}).catch((error)=>{
			console.log(error)
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