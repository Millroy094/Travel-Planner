'use strict'

const Database = require('../Schema/preferenceSchema')


exports.clearAllPreferences = () =>  new Promise ((resolve, reject) =>{

	
	Database.Preference.remove({}, (err)=>{
		if(err) reject (`${err}`)
		resolve ('All preferences deleted')
	})
	

})

exports.savePreference = preferInfo => new Promise ((resolve, reject) => {

	if('id' in preferInfo && 'origin' in preferInfo && 'destination' && preferInfo && 'modified' in preferInfo )
		
		preferenceExists(preferInfo.id).then(()=>{

			const prefer = new Database.Preference(preferInfo)
			
			prefer.save( (err, preference) => {
				if (err) {
					reject('an error saving preference')
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

		if (err) reject ('database error')
		if (!preferences.length) reject('No preferences found')
		resolve(preferences)
	})


})


exports.deleteByID = id => new Promise((resolve, reject) => {

	Database.Preference.findOneAndRemove({ id: `${id}`}, (err) => {

		if(err) reject('Database error! preference could not be deleted')
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

		if (err) reject ('database error')
		if (!preferences.length) resolve ()
		reject('Preference already exists')
	})


	})


}

exports.clearAllUsers = () =>  new Promise ((resolve, reject) =>{

	Database.Accounts.remove({}, (err)=>{
		if(err) reject (`${err}`)
		resolve ('All users deleted')
	})

})

exports.addAccount = details => new Promise( (resolve, reject) => {
	
	if ('username' in details && 'password' in details ) {
		const user = new Database.Accounts(details)

		user.save( (err, user) => {
			if (err) {
				reject('error creating account')
			}
			
			resolve('New user added')
		})	
		
	}
	else {
		reject('invalid user object')
	}
})

exports.accountExists = username => new Promise( (resolve, reject) => {
	Database.Accounts.find({username: username}, (err, findings) => {
		if (findings.length) reject(`username already exists`)
		resolve()
	})
})

exports.getPassword = username => new Promise( (resolve, reject) => {
	const firstIndex = 0
	Database.Accounts.find({username: username}, (err, docs) => {
		if (err) reject('database error')
		if (!docs.length) reject(`invalid username`)
		resolve(docs[firstIndex].password) 
		
		
	})
})

