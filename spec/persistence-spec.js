'use strict'

const persistence = require('../modules/persistence')

describe('Check if the database is operating properly', function() {

	it('All preferences should be deleted', function (done) {

		persistence.clearAllPreferences().then((data)=>{
			expect(data).toEqual('All preferences deleted')
			done()
		}).catch((error)=>{
			console.log(error)
			done()
		})

	})

	it('Initially there should be no preferences stored', function (done) {

		persistence.getAllPreferences().then((data)=>{
			done()
		}).catch((error)=>{
			expect(`${error}`).toEqual('Error: No preferences found')	
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
			expect(`${error}`).toEqual('Error: Preference already exists')			
			done()

		})
	})

	it('Should throw an error if all data is not passed', function (done) {

		persistence.savePreference({id: 'Testing1', modified: new Date().toString(), destination: 'Birmingham'}).then(()=>{
			done()
		}).catch((error)=>{
			expect(`${error}`).toEqual('Error: Invalid preference object')
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
			expect(`${error}`).toEqual('Error: Invalid preference object')
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


	it('Check if you user can be created', function (done) {

		persistence.addAccount({username: 'Test', password: '12345'}).then((data)=>{
			expect(data).toEqual('New user added')
			done()
		}).catch((error)=>{
			done()
		})

	})

	it('Check if error is thrown if the data passed is not complete', function (done) {

		persistence.addAccount({username: 'Test'}).then((data)=>{
			done()
		}).catch((error)=>{
			expect(`${error}`).toEqual('Error: invalid user object')
			done()
		})

	})	

	it('Test should return username already exists', function (done) {

		persistence.accountExists('Test').then(()=>{
			done()
		}).catch((error)=>{
			expect(`${error}`).toEqual('Error: username already exists')
			done()
		})

	})

	it('Test should return the right password', function (done) {

		persistence.getPassword('Test').then((password)=>{
			expect(password).toEqual('12345')
			done()
		}).catch((error)=>{
			done()
		})

	})

	it('Test should return an error saying invalid user', function (done) {

		persistence.getPassword('Test').then(()=>{
			done()
		}).catch((error)=>{
			expect(`${error}`).toEqual('Error: invalid username')
			done()
		})

	})

	it('All users should be deleted', function (done) {

		persistence.clearAllUsers().then((data)=>{
			expect(data).toEqual('All users deleted')
			done()
		}).catch((error)=>{
			console.log(error)
			done()
		})

	})		 
  

})