'use strict'

const persistence = require('../modules/persistence')

describe('Check is preference module is store, retrive, modify, delete preferences', function() {


	it('Initially there should be no preferences stored', function (done) {

		persistence.getAllPreferences().then((data)=>{
			done()
		}).catch((error)=>{
			expect(error).toEqual('No preferences found')	
			done()
		})

	}) 

	it('Should save data', function (done) {

		persistence.savePreference({id: 'Testing', modified: new Date().toString(), origin: 'Swindon', destination: 'Birmingham'}).then((data)=>{
			expect(data).toEqual('Save Successful')
			done()
		}).catch((error)=>{
			console.log(error)
			done()

		})

	})


	it('Should throw an error if preference already present', function (done) {

		persistence.savePreference({id: 'Testing', modified: new Date().toString(), origin: 'Swindon', destination: 'Birmingham'}).then(()=>{
			done()
		}).catch((error)=>{
			expect(error).toEqual('Preference already exists')			
			done()

		})
	})

	it('Should throw an error if all data is not passed', function (done) {

		persistence.savePreference({id: 'Testing1', modified: new Date().toString(), destination: 'Birmingham'}).then(()=>{
			done()
		}).catch((error)=>{
			expect(error).toEqual('Invalid preference object')
			done()

		})

	})

	it('Should update data', function (done) {

		persistence.updateByID({id: 'Testing', modified: new Date().toString(), origin: 'Coventry', destination: 'Birmingham'}).then((data)=>{
			expect(data).toEqual('Preference with the name Testing is Updated')
			done()
		}).catch((error)=>{
			console.log(error)
			done()

		})

	})

	it('Should throw an error if all data to be updated is not passed', function (done) {

		persistence.updateByID({id: 'Testing', modified: new Date().toString(), destination: 'Birmingham'}).then(()=>{
			done()
		}).catch((error)=>{
			expect(error).toEqual('Invalid preference object')
			done()

		})

	})

	it('Should return number of preferences stored', function (done) {

		persistence.getAllPreferences().then((data)=>{
			expect(data.length).toEqual(1)
			done()
		}).catch((error)=>{
			console.log(error)
			done()
		})

	})


	it('Should delete the preference', function (done) {

		persistence.deleteByID('Testing').then((data)=>{
			expect(data).toEqual('preference with id Testing is deleted')
			done()

		}).catch((error)=>{
			console.log(error)
			done()
		})

	}) 
  

})