'use strict'

/* Module to manage users */

const globals = require('./globals')
const Integrator = require('./Integrator')
const Prefer = require('./preferenceSchema')



/* This object will store the prefered origin and destination */
let preferences = []

const empty = 0

/**
 * this is a private function that can only be accessed from inside the module. It checks that the json data supplied in the request body comprises a single array of strings. The parameter contains the string passed in the request body.
 * @private
 * @param {string} json - the string to check
 * @returns {boolean} whether the string is valid
 */
function validateNewJson(json) {
	if (json === undefined) {
		//console.log('UNDEFINED')
		return false
	}
	
	if (typeof json.journey !== 'string') {
		//console.log(`NAME NOT STRING`)
		return false
	}


	if (typeof json.origin !== 'string') {
		//console.log(`NAME NOT STRING`)
		return false
	}

	if (typeof json.destination !== 'string') {
		//console.log(`NAME NOT STRING`)
		return false
	}

	/* otherwise return true */
	return true
}


function validateUpdateJson(json) {
	if (json === undefined) {
		//console.log('UNDEFINED')
		return false
	}

	if (typeof json.origin !== 'string') {
		//console.log(`NAME NOT STRING`)
		return false
	}

	if (typeof json.destination !== 'string') {
		//console.log(`NAME NOT STRING`)
		return false
	}

	/* otherwise return true */
	return true
}

exports.initialize = function(){

	Prefer.find({}, (err, result) => {

		preferences = result

	})

}


exports.clear = function() {
	preferences = []
}

/* This public property contains a function that is passed a resource id and returns the associated list. */
exports.getByID = function(preferenceID) {
	//console.log('GET BY ID')
	
	return new Promise ((resolve, reject) => {

		const foundPreference = preferences.find( function(value) {
			return value.id === preferenceID
		})
		if (foundPreference === undefined) {
			//console.log('NOT FOUND')
			reject ({
				status: globals.status.notFound,
				format: globals.format.json,
				message: 'Preference not found'
			})
		}
		
		else {
		
			Integrator.getData(foundPreference.origin, foundPreference.destination).then((data)=>{
				resolve(data)
			}).catch((error) => {
				reject(error)
			})

		}
	})


	
}

/* This public property contains a function that returns an array containing summaries of each preference stored. The summary contains the preference name and also the URL of its full resource. This is an important feature of RESTful APIs. */
exports.getAll = function(host) {
	/* If there are no lists we return a '404' error. */
	if (preferences.length === empty) {
		return {
			status: globals.status.notFound,
			format: globals.format.json,
			message: 'no preferences found'
		}
	}
	/* The 'map' function is part of the Array prototype and takes a single function parameter. It applies this function to each element in the array. It returns a new array containing the data returned from the function parameter. See also 'Array.filter()' and 'Array.reduce()'. */
	const notes = preferences.map(function(item) {
		return { journey: item.id, origin: item.origin, destination: item.destination, link: `http://${host}/preferences/${item.id}`}
	})
	return {
		status: globals.status.ok,
		format: globals.format.json,
		message: `${notes.length} preferences found`,
		data: notes
	}
}

/* This public property contains a function to add a new preference to the module. */
exports.addNew = function(user, body) {
	
	return new Promise((resolve,reject) => {

		/* The first parameter should contain the authorization data. We check that it contains an object called 'basic' */
		if (user === undefined) {
			reject ({
				status: globals.status.unauthorized,
				format: globals.format.json,
				message: 'missing basic auth'
			})
		}
		/* In this simple example we have hard-coded the username and password. You should be storing this somewhere are looking it up. */
		if (user.name !== 'testuser' || user.pass !== 'p455w0rd') {
			reject ({
				status: globals.status.unauthorized,
				format: globals.format.json,
				message: 'invalid credentials'
			})
		}

		const valid = validateNewJson(body)
		/* If the 'validateJson()' function returns 'false' we need to return an error. */
		if (valid === false) {
			reject ({
				status: globals.status.badRequest,
				format: globals.format.json,
				message: 'JSON data missing in request body'
			})
		}
		
		const {journey, origin, destination} = body


		const foundPreference = preferences.find( function(value) {
			return value.id === journey
		})

		if(!foundPreference) {


			const id = `${journey}`
			const modified = new Date()

			const prefer = new Prefer({

				id: id,
				modified: modified,
				origin: origin,
				destination: destination
			})

			prefer.save( (err, done) => {

				if(err) {

					reject({
						status: globals.status.badRequest,
						format: globals.format.json,
						message: `${error}`
					})
				}


			})

			const newPreference = {id, modified, origin, destination}
			preferences.push(newPreference)
			
			const data = { status: globals.status.created, format: globals.format.json, message: "Preference created", data : newPreference}
			resolve(data)

	
		}

		else {
			reject ({
				status: globals.status.badRequest,
				format: globals.format.json,
				message: 'Journey name already held by anthoner preference'
			})
		}
	})

}

/* This public property contains a function to delete an existing preference in preferences. */
exports.deleteByID = function(user, preferenceID) {
	
	return new Promise((resolve,reject) => {

		/* The first parameter should contain the authorization data. We check that it contains an object called 'basic' */
		if (user === undefined) {
			reject ({
				status: globals.status.unauthorized,
				format: globals.format.json,
				message: 'missing basic auth'
			})
		}
		/* In this simple example we have hard-coded the username and password. You should be storing this somewhere are looking it up. */
		if (user.name !== 'testuser' || user.pass !== 'p455w0rd') {
			reject ({
				status: globals.status.unauthorized,
				format: globals.format.json,
				message: 'invalid credentials'
			})
		}
		


		for (let preference in preferences){
			
			if(preferences[preference].id === preferenceID) {
				
				Prefer.findOneAndRemove({ id: `${preferenceID}`}, (err) => {

					if(err) {
						reject({
							status: globals.status.notFound,
							format: globals.format.json,
							message: `${err}`
						})

					}

				})

				preferences= removeItem(preference)
				const data = { status: globals.status.ok, format: globals.format.json, message: `Preference ${preferenceID} is sucessfully deleted`}
				resolve(data)
			}
		}

		const data = { status: globals.status.notFound, format: globals.format.json, message: `Preference ${preferenceID} not found`}
		reject(data)
		




	})

}

exports.updateByID = function(user, body, preferenceID){
	
	return new Promise((resolve, reject) => {

		if (user === undefined) {
			reject({
				status: globals.status.unauthorized,
				format: globals.format.json,
				message: 'missing basic auth'
			})
		}
		
		if (user.name !== 'testuser' || user.pass!== 'p455w0rd') {
			reject({
				status: globals.status.unauthorized,
				format: globals.format.json,
				message: 'invalid credentials'
			})
		}


		const valid = validateUpdateJson(body)

		if (valid === false) {
			reject({
				status: globals.status.badRequest,
				format: globals.format.json,
				message: 'JSON data missing in request body'
			})
		}


		const {origin, destination} = body
		
		for (let preference in preferences){

			if(preferences[preference].id === preferenceID){
				
				const modified = new Date();

				Prefer.findOneAndUpdate({ id: `${preferenceID}`}, {origin: origin, destination: destination, modified: modified}, (err, done) => {

					if(err) {
						reject({
							status: globals.status.notFound,
							format: globals.format.json,
							message: `${err}`
						})

					}

				})

				preferences[preference].origin = origin
				preferences[preference].destination = destination 
				preferences[preference].modified = modified
				const data = {status: globals.status.ok, format: globals.format.json, message: `Preference with the name ${preferenceID} is Updated` }

				resolve(data)
			}
			

			}

			reject({
			status: globals.status.notFound,
			format: globals.format.json,
			message: `preference not found`
		})
	})

}




function removeItem(preference) {
	let newPreferences = []
	for (let iteration in preferences){
		if(iteration !== preference)
		newPreferences.push(preferences[iteration])
	}
	return newPreferences
}

