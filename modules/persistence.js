'use strict'

const Prefer = require('./preferenceSchema')

exports.savePreference = preferInfo => new Promise ((resolve, reject) => {

	if(!'id' in preferInfo && !'origin' in preferInfo && !'destination' in preferInfo && !'modified' in preferInfo )
		reject (new Error ('Invalid preference object'))

	const prefer = new Prefer(preferInfo)
	
	prefer.save( (err, preference) => {
		if (err) {
			reject(new Error('an error saving book'))
		}
		resolve("Save Successful")
	})


})

exports.getAllPreferences = () => new Promise ((resolve, reject) => {

	Prefer.find({}, (err, preferences) => {

		if (err) reject (new Error ('database error'))
		if (!preferences.length) reject(new Error('No preferences found'))
		resolve(preferences)
	})


})


exports.deleteByID = id => new Promise((resolve, reject) => {

	Prefer.findOneAndRemove({ id: `${id}`}, (err) => {

		if(err) reject(new Error ('Database error! preference could not be deleted'))
		resolve (`preference with id ${id} is deleted`)

	})



})


exports.updateByID = preferInfo => new Promise ((resolve, reject) => { 

	if(!'id' in preferInfo && !'origin' in preferInfo && !'destination' in preferInfo && !'modified' in preferInfo )
		reject (new Error ('Invalid preference object'))

	Prefer.findOneAndUpdate({ id: preferInfo.id }, {origin: preferInfo.origin, destination: preferInfo.destination, modified: preferInfo.modified}, (err, done) => {

		if(err) reject('Database error! preference could not be updated')
		resolve(`Preference with the name ${preferInfo.id} is Updated`)

		

})



})