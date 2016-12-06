'use strict'

/**
 * preferences module.
 * @module preferences
 */

/* Module to manage users */

const globals = require('./modules/globals')
const forecast = require('./modules/weather')
const directions = require('./modules/directions')
const persistence = require('./modules/persistence')
const authorization = require('./modules/Authorization')


/* This object will store the prefered origin and destination */
let preferences = []

const empty = 0

/**
 * this is a private function that can only be accessed from inside the module. It checks that the json data supplied in the request body comprises a single array of strings. The parameter contains the string passed in the request body.
 * @function validateNewJson
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
	}	else {

		return false
	}

}

/**
 * This function is used for validating the body data for an update
 * @function validateUpdateJson
 * @private
 * @param {string} json - the string to check
 * @returns {boolean} whether the string is valid
 */
function validateUpdateJson(json) {
	if (json === undefined) {

		return false
	}

	if('origin' in json && 'destination' in json ) {
		return true
	}	else {

		return false
	}
}


/**
 * This function initializes the preferences by pulling the data from the database
 * @function initialize
 * @public
 * @returns {Promise} with either number of preferences or an error if nothing is found
 */
exports.initialize = () => new Promise((resolve, reject) => {

	persistence.getAllPreferences().then((data) => {

		preferences = data
		resolve(preferences.length)

	}).catch((error) => {
		reject(error)
	})

})

/**
 * Returns a combination of weather and direction information for the preference
 * @function getByID
 * @public
 * @param {string} preferenceID - represents the id of the preference
 * @param {string} host - represents the host the API is running on
 * @returns {Promise} returns valid data or returns an error
 */
exports.getByID = (preferenceID, host) => new Promise ((resolve, reject) => {

	/* returns the found set of all the preferences matching the preference id */

	const foundPreference = preferences.find( function(value) {
		return value.id === preferenceID
	})

	/* if no data found reject with an error */

	if (foundPreference === undefined) {

		reject ({
			status: globals.status.notFound,
			format: globals.format.json,
			message: 'Preference not found'
		})
	}	else {

		const origin = foundPreference.origin
		const destination = foundPreference.destination

		directions.getDistance(origin, destination).then((data) => {
			this.distance = data
			return directions.getDuration(origin, destination)
		}).then((data) => {
			this.duration = data
			return directions.getDirections(origin, destination)
		}).then((data) => {
			this.steps = data
			return directions.getCoordinates(origin, destination)
		}).then((data) => forecast.getForecast(data.lat, data.lng)).then((data) => {
			this.weather = data
			resolve ({status: globals.status.ok, format: globals.format.json,
				data: { _links: { self: { href: `http://${host}/preferences/${preferenceID}`} },Origin: origin, Destination: destination, Distance: this.distance, Duration: this.duration, Directions: this.steps, Weather: this.weather}
			})
		}).catch((error) => {
			reject({status: globals.status.notFound,
				format: globals.format.json,
				message: `${error}`
			})
		})

	}
})


/**
 * This public property contains a function that returns an array containing summaries of each preference stored. The summary contains the preference name and also the URL of its full resource.
 * @function getAll
 * @public
 * @param {string} host - represents the host the application is running on
 * @returns {Promise} returns valid data or returns an error
 */
exports.getAll = function(host) {

	/* Checks the length of the preferences array if it zero returns an error message*/

	if (preferences.length === empty) {
		return {
			status: globals.status.notFound,
			format: globals.format.json,
			message: 'no preferences found'
		}
	}

	/* If found maps through the preferences makes an list of objects with all the information in it to sent it as a response */

	const notes = preferences.map(function(item) {
		return { _links: { self: { href: `http://${host}/preferences/${item.id}`} }, journey: item.id, origin: item.origin, destination: item.destination}
	})

	/* And returns a response with the data */

	return {
		status: globals.status.ok,
		format: globals.format.json,
		message: `${notes.length} preferences found`,
		data: notes
	}
}

/**
 * Adds the new preference supplied in the body to the list of preferences
 * @function addNew
 * @public
 * @param {authorization} auth - represents the authorization data supplied in the http request
 * @param {body} body - represents the data to be added, supplied in the http request
 * @param {string} host - represents the host the API is running on
 * @returns {Promise} returns approval of the newly added data or returns an error
 */
exports.addNew = (auth, body, host) => new Promise((resolve,reject) => {

	/* Authenticates the request, if failed authentication rejects with an error */

	authenticate(auth).then(() => {

		/* body received through the request is validated */

		const valid = validateNewJson(body)

		/* if invalid, rejected with an error */

		if (valid === false) {
			reject ({
				status: globals.status.badRequest,
				format: globals.format.json,
				message: 'JSON data missing in request body'
			})
		}

		/* Applies the conetents on the body to constants */

		const {journey, origin, destination} = body

		/* Checks if preference is already existent */

		const foundPreference = preferences.find( function(value) {
			return value.id === journey
		})

		/* if not then goes ahead creating a new preference */

		if(!foundPreference) {


			const id = `${journey}`
			const modified = new Date()

			/* save data on the database and also push it in the preferences object, if there is an error it is rejected with an error */

			persistence.savePreference({id: id, modified: modified, origin: origin, destination: destination}).then(() => {

				const newPreference = {id, modified, origin, destination}

				preferences.push(newPreference)

				const result = { status: globals.status.created, format: globals.format.json, message: 'Preference created', data: { _links: { self: { href: `http://${host}/preferences/${newPreference.id}`} }, preference: newPreference}}

				resolve(result)

			}).catch((error) => {

				reject({
					status: globals.status.badRequest,
					format: globals.format.json,
					message: `${error}`
				})
			})

		}			else {
			reject ({
				status: globals.status.badRequest,
				format: globals.format.json,
				message: 'Journey name already held by another preference'
			})
		}


	}).catch((error) => {
		reject ({
			status: globals.status.badRequest,
			format: globals.format.json,
			message: `${error}`
		})
	})


})


/**
 * Deletes an existing preference
 * @function deleteByID
 * @public
 * @param {authorization} auth - represents the authorization data supplied in the http request
 * @param {string} preferenceID - represents the id of the preference to be deleted
 * @param {string} host - represents the host the API is running on
 * @returns {Promise} returns approval of the deleted data or returns an error
 */
exports.deleteByID = (auth, preferenceID, host) => new Promise((resolve,reject) => {

	/* Authenticates the request, if failed authentication rejects with an error */

	authenticate(auth).then(() => {
	        const foundPreference = preferences.find( function(value) {
		return value.id === preferenceID
	})

	/* If item is found goes ahead deleting it from the database, if not it is rejected with an error */

		if (!foundPreference) {
			reject({
				status: globals.status.notFound,
				format: globals.format.json,
				message: 'Preference not in list'
			})
		}

		return persistence.deleteByID(preferenceID)
	}).then(() => {

	/* If data was deleted sucessfully it then filters from the data in preferences list and chucks out one with same preference id */

		preferences = preferences.filter(preference => preference.id !== preferenceID)
		const data = { status: globals.status.ok, format: globals.format.json, message: `Preference ${preferenceID} is sucessfully deleted`, data: { _links: { all_preferences: { href: `http://${host}/preferences`} } }}

		resolve(data)

	}).catch((error) => {
		reject({
			status: globals.status.notFound,
			format: globals.format.json,
			message: `${error}`
		})

	})


})

/**
 * Updates an existing preference
 * @function updateByID
 * @public
 * @param {authorization} auth - represents the authorization data supplied in the http request
 * @param {body} body - represents the data to be added, supplied in the http request
 * @param {string} preferenceID - represents the id of the preference to be deleted
 * @param {string} host - represents the host the API is running on
 * @returns {Promise} returns approval of the newly added data or returns an error
 */
exports.updateByID = (auth, body, preferenceID, host) => new Promise((resolve, reject) => {

	/* Authenticates the request, if failed authentication rejects with an error */

	authenticate(auth).then(() => {

		/* body received through the request is validated */

		const valid = validateUpdateJson(body)

		/* if data is not valid it rejects it with an error */

		if (valid === false) {
			reject({
				status: globals.status.badRequest,
				format: globals.format.json,
				message: 'JSON data missing in request body'
			})
		}

		/* Checks through all the preferences and finds the one with the same preference id */

		const foundPreference = preferences.find( function(value) {
			return value.id === preferenceID
		})

		/* If found it goes ahead with the update, if not it rejects it with an error */

		if (!foundPreference) {
			reject({
				status: globals.status.notFound,
				format: globals.format.json,
				message: 'Preference not in list'
			})
		}

		/* Body data is applied to constants */

		const {origin, destination} = body

		/* Loops through all the preferences finding one to update */

		for (const preference in preferences){

			/* When it finds it, it updates preferences object and also the database. If at all there is an error, it sends a rejection*/

			if(preferences[preference].id === preferenceID){

				const modified = new Date()

				persistence.updateByID({id: preferenceID, modified: modified, origin: origin, destination: destination}).then(() => {

					preferences[preference].origin = origin
					preferences[preference].destination = destination
					preferences[preference].modified = modified
					const data = {status: globals.status.ok, format: globals.format.json, message: `Preference with the name ${preferenceID} is Updated`, data: { _links: { self: { href: `http://${host}/preferences/${preferences[preference].id}`} }, preference: preferences[preference]} }

					resolve(data)

				/* Rejection if there is an error with the database */

				}).catch((error) => {
					reject({
						status: globals.status.notFound,
						format: globals.format.json,
						message: `${error}`
					})

				})

			}

		}

	/* Rejection if there is an error with the authentication */

	}).catch((error) => {
		reject({
			status: globals.status.notFound,
			format: globals.format.json,
			message: `${error}`
		})


	})

})

/**
 * Creates an new user in the database
 * @function addUser
 * @public
 * @param {body} body - represents the data to be added, supplied in the http request
 * @returns {Promise} returns approval of the newly added data or returns an error
 */
exports.addUser = body => new Promise((resolve, reject) => {

	/* Gets the data from the body and assigns it to constants */
	const {username, password} = body
	const Account = {username: username, password: password}

	/* Runs in chain of promises compromising of checks, conversions, and storage of new user account */

	persistence.accountExists(Account.username).then(() => authorization.getHashValue(Account.password)).then((password) => {
		Account.password=password
		return persistence.addAccount(Account)
	}).then((data) => {
		const result = {status: globals.status.created, format: globals.format.json, message: data}

		resolve(result)
	}).catch((error) => {
		const data = {status: globals.status.badRequest, format: globals.format.json, message: `${error}`}

		reject(data)
	})


})

/**
 * Authenticates the data passed in the authorization header
 * @function authenticate
 * @private
 * @param {authorization} auth - represents the authorization data supplied in the http request
 * @returns {Promise} returns approval of data being authenticated or a rejection
 */
function authenticate(auth){

	return new Promise((resolve, reject) => {

		/* Goes through a chain of persistence and authorization promises to authenticate the user */

		let user

		authorization.validateHeader(auth).then((credentials) => {
			user = credentials
			return persistence.getPassword(user.username)
		}).then((password) => {
			user.storedHash = password
			return authorization.validateUser(user.password, user.storedHash)
		}).then(() => {
			resolve()
		}).catch((error) => {
			reject(error)
		})

	})


}

/**
 * Deletes all the users in the database
 * @function deleteAllUsers
 * @public
 * @returns {Promise} returns approval of the deletion or a rejction with an error
 */
exports.deleteAllUsers = () => new Promise((resolve, reject) => {

	persistence.clearAllUsers().then((data) => {
		resolve(data)
	}).catch((error) => {
		reject(error)
	})

})

/**
 * Deletes all the users in the database
 * @function deleteAllPreferences
 * @public
 * @returns {Promise} returns approval of the deletion or a rejction with an error
 */
exports.deleteAllPreferences = () => new Promise((resolve, reject) => {

	persistence.clearAllPreferences().then((data) => {
		preferences = []
		resolve(data)
	}).catch((error) => {
		reject(error)
	})

})


