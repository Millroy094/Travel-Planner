'use strict'

/* Module to manage users */

const globals = require('./modules/globals')
const forecast = require('./modules/weather')
const directions = require('./modules/directions')
const persistence = require('./modules/persistence')
const authorization = require('./modules/authorization')




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
		return false
	}
	
	if('journey' in json && 'origin' in json && 'destination' in json ) {
		return true
	}

	else {

		return false
	}

}


function validateUpdateJson(json) {
	if (json === undefined) {
		
		return false
	}

	if('origin' in json && 'destination' in json ) {
		return true
	}

	else {

		return false
	}
}

exports.initialize = () =>  new Promise((resolve, reject)=>{

	persistence.getAllPreferences().then((data)=>{

		preferences = data
		resolve(preferences.length)

	}).catch((error) =>{
		reject(error)
	})

})






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
			
			const origin = foundPreference.origin
			const destination = foundPreference.destination

			directions.getDistance(origin, destination).then((data)=>{
				this.distance = data
				return directions.getDuration(origin, destination)
			}).then((data)=>{
				this.duration = data
				return directions.getDirections(origin, destination)
			}).then((data)=>{
				this.steps = data
				return directions.getCoordinates(origin, destination)
			}).then((data)=> {
				return forecast.getForecast(data.lat, data.lng)
			}).then((data)=>{
				this.weather = data
				resolve ({status: globals.status.ok, format: globals.format.json, 
					data : { Origin: origin, Destination: destination, Distance: this.distance, Duration: this.duration, Directions: this.steps, Weather : this.weather}
				})
			}).catch((error)=>{
				reject({status: globals.status.notFound, 
					format: globals.format.json, 
					message: `${error}`
				})
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
exports.addNew = function(auth, body) {
	
	return new Promise((resolve,reject) => {
		 
		authenticate(auth).then(()=>{
			const valid = validateNewJson(body)
		
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


				persistence.savePreference({id: id, modified: modified, origin: origin, destination: destination}).then((data) =>{
					const newPreference = {id, modified, origin, destination}
					preferences.push(newPreference)
					const result = { status: globals.status.created, format: globals.format.json, message: "Preference created", data : newPreference}
					resolve(result)
				}).catch((error)=>{
					reject({
						status: globals.status.badRequest,
						format: globals.format.json,
						message: `${error}`
						})
				})

			}

			else {
				reject ({
					status: globals.status.badRequest,
					format: globals.format.json,
					message: 'Journey name already held by another preference'
				})
			}


		}).catch((error)=>{
			reject ({
				status: globals.status.badRequest,
				format: globals.format.json,
				message: `${error}`
			})
		})
		
	




	})

}

/* This public property contains a function to delete an existing preference in preferences. */
exports.deleteByID = function(auth, preferenceID) {
	
	return new Promise((resolve,reject) => {

		authenticate(auth).then(()=>{
	        const foundPreference = preferences.find( function(value) {
				return value.id === preferenceID
			})
			
			if (!foundPreference) {
				reject({
					status: globals.status.notFound,
					format: globals.format.json,
					message: 'Preference not in list'
				})
			}
	
			return persistence.deleteByID(preferenceID)
			}).then(()=>{

				preferences = preferences.filter(preference => preference.id !== preferenceID)
				const data = { status: globals.status.ok, format: globals.format.json, message: `Preference ${preferenceID} is sucessfully deleted`}
				resolve(data)

			}).catch((error)=>{
				reject({
				status: globals.status.notFound,
				format: globals.format.json,
				message: `${error}`
				})

			})


	})

}

exports.updateByID = function(auth, body, preferenceID){
	
	return new Promise((resolve, reject) => {


		authenticate(auth).then(()=>{

			const valid = validateUpdateJson(body)

			if (valid === false) {
				reject({
					status: globals.status.badRequest,
					format: globals.format.json,
					message: 'JSON data missing in request body'
				})
			}

			const foundPreference = preferences.find( function(value) {
				return value.id === preferenceID
			})
			
			if (!foundPreference) {
				reject({
					status: globals.status.notFound,
					format: globals.format.json,
					message: 'Preference not in list'
				})
			}



			const {origin, destination} = body
			
			
			for (let preference in preferences){

				if(preferences[preference].id === preferenceID){
					
					const modified = new Date();

					persistence.updateByID({id: preferenceID, modified: modified, origin: origin, destination: destination}).then(()=>{
						
						preferences[preference].origin = origin
						preferences[preference].destination = destination 
						preferences[preference].modified = modified
						const data = {status: globals.status.ok, format: globals.format.json, message: `Preference with the name ${preferenceID} is Updated` }					
						resolve(data)


					}).catch((error)=>{
						reject({
							status: globals.status.notFound,
							format: globals.format.json,
							message: `${error}`
						})

					})

				}
				
			}

		}).catch((error)=>{
			reject({
				status: globals.status.notFound,
				format: globals.format.json,
				message: `${error}`
			})
		
		

		})

	})

}	



exports.addUser = function(body){
	
	return new Promise((resolve, reject) => {

			const {username, password} = body
			const Account = {username: username, password: password}

			persistence.accountExists(Account.username).then(()=>{
				return authorization.getHashValue(Account.password)
			}).then((password)=>{
				Account.password=password
				return persistence.addAccount(Account)
			}).then((data)=>{
				const result = {status: globals.status.created, format: globals.format.json, message: data}
				resolve(result)
			}).catch((error)=>{
				const data = {status: globals.status.badRequest, format: globals.format.json, message: `${error}`}
				reject(data)
			})




	})


}

function authenticate(auth){
	return new Promise((resolve, reject) => {

		let user

		authorization.validateHeader(auth).then((credentials)=>{
			user = credentials
			return persistence.getPassword(user.username)
		}).then((password)=>{
			user.storedHash = password
			return authorization.validateUser(user.password, user.storedHash)
		}).then(()=>{
			resolve()
		}).catch((error)=>{
			reject(error)
		})

	})


}

exports.deleteAllUsers = () => new Promise((resolve, reject) => {

		persistence.clearAllUsers().then((data)=>{
			resolve(data)
		}).catch((error)=>{
			reject(error)
		})

	})

exports.deleteAllPreferences = () => new Promise((resolve, reject) => {

		persistence.clearAllPreferences().then((data)=>{
			resolve(data)
		}).catch((error)=>{
			reject(error)
		})

	})





