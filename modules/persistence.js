'use strict'

const Database = require('../Schema/preferenceSchema')


exports.savePreference = preferInfo => new Promise ((resolve, reject) => {

	if('id' in preferInfo && 'origin' in preferInfo && 'destination' && preferInfo && 'modified' in preferInfo )
		
		preferenceExists(preferInfo.id).then(()=>{

			const prefer = new Database.Preference(preferInfo)
			
			prefer.save( (err, preference) => {
				if (err) {
					reject(new Error('an error saving book'))
				}
				resolve("Save Successful")
			})
		}).catch((error) => {
			reject(error)
		})

		
	else {
		reject ('Invalid preference object')	
	}
})

exports.getAllPreferences = () => new Promise ((resolve, reject) => {

	Database.Preference.find({}, (err, preferences) => {

		if (err) reject (new Error ('database error'))
		if (!preferences.length) reject('No preferences found')
		resolve(preferences)
	})


})


exports.deleteByID = id => new Promise((resolve, reject) => {

	Database.Preference.findOneAndRemove({ id: `${id}`}, (err) => {

		if(err) reject(new Error ('Database error! preference could not be deleted'))
		resolve (`preference with id ${id} is deleted`)

	})



})


exports.updateByID = preferInfo => new Promise ((resolve, reject) => { 

	if('id' in preferInfo && 'origin' in preferInfo && 'destination' in preferInfo && 'modified' in preferInfo ){
		
		Database.Preference.findOneAndUpdate({ id: preferInfo.id }, {origin: preferInfo.origin, destination: preferInfo.destination, modified: preferInfo.modified}, (err, done) => {

			if(err) reject('Database error! preference could not be updated')
			resolve(`Preference with the name ${preferInfo.id} is Updated`)	
		})
		
	}

	else reject ('Invalid preference object')


})

function preferenceExists(preferenceID){
	return new Promise((resolve, reject)=> {

		Database.Preference.find({id: preferenceID}, (err, preferences) => {

		if (err) reject (new Error ('database error'))
		if (!preferences.length) resolve ()
		reject('Preference already exists')
	})


	})


}

exports.addAccount = details => new Promise( (resolve, reject) => {
	
	if ('username' in details && 'password' in details ) {
		const user = new Database.Accounts(details)

		user.save( (err, user) => {
			if (err) {
				reject(new Error('error creating account'))
			}
			
			resolve('New user added')
		})	
		
	}
	else {
		reject(new Error('invalid user object'))
	}
})

exports.accountExists = username => new Promise( (resolve, reject) => {
	Database.Accounts.find({username: username}, (err, findings) => {
		if (findings.length) reject(new Error(`username already exists`))
		resolve()
	})
})

exports.getPassword = username => new Promise( (resolve, reject) => {
	Database.Accounts.find({username: username}, (err, docs) => {
		if (err) reject(new Error('database error'))
		if (!docs.length) reject(new Error(`invalid username`))
		resolve(docs) 
		
		
	})
})

