
'use strict'
/**
 * directions module.
 * @module directions
 */
/**
 * Callback used by apiCall
 * @callback apiCallback
 * @param {error} err - error returned (null if no error)
 * @param {data} route - the data returned as an object
 */
const request = require('request')
const replaceAll = require('replaceall')
/**
 * returns the driving distance between two locations
 * @param {string} origin - the starting location for the journey
 * @param {string} destination - the ending location for the journey
 * @param {apiCallback} callback - the callback run when api call is completed
 * @returns {null} no return value
 */
exports.getDistance = (origin, destination) => {
	
	return new Promise((resolve, reject) => {

		apiCall(origin, destination).then((result) => {
			resolve(result.distance.text)
		}).catch((error) => {
			reject(error)
		})

	})


}

/**
 * returns the driving duration between two locations
 * @param {string} origin - the starting location for the journey
 * @param {string} destination - the ending location for the journey
 * @returns {Promise} returns the duration or an error message
 */

exports.getDuration = (origin, destination) => {
	return new Promise((resolve, reject) => {

		apiCall(origin, destination).then((result) => {
			resolve(result.duration.text)
		}).catch((error) => {
			reject(error)
		})

	})
}

/**
 * returns the lattitude and longitude of the location
 * @param {string} origin - the starting location for the journey
 * @param {string} destination - the ending location for the journey
 * @param {apiCallback} callback - the callback run when api call is completed
 * @returns {null} no return value
 */

exports.getCoordinates = (origin, destination) => {

	return new Promise((resolve, reject) => {

		apiCall(origin, destination).then((result) => {
			resolve(result.end_location)
		}).catch((error) => {
			reject(error)
		})

	})
}


/**
 * returns the driving steps between two locations
 * @param {string} origin - the starting location for the journey
 * @param {string} destination - the ending location for the journey
 * @param {apiCallback} callback - the callback run when api call is completed
 * @returns {null} no return value
 */

exports.getDirections = (origin, destination, callback) => {

	return new Promise((resolve, reject) => {

		apiCall(origin, destination).then((result) => {
			const steps = []
			steps.push("Directions to get there:")
			
			for (let step in result.steps){	
				steps.push(replaceAll("</b>", "",replaceAll("<b>", "",result.steps[step].html_instructions)))
			}

			resolve(steps)

		}).catch((error) => {
			reject(error)
		})

	})


}

/**
 * @function apiCall
 * @param {string} origin - the starting location for the journey
 * @param {string} destination - the ending location for the journey
 * @param {apiCallback} callback - the callback run when api call is completed
 * @returns {null} no return value
 */
function apiCall(origin, destination) {
	return  new Promise((resolve, reject) => {
		
		const firstIndex = 0
		const url = `https://maps.googleapis.com/maps/api/directions/json?region=gb&origin=${origin}&destination=${destination}`
		console.log(url)
		
		request.get(url, (err, res, body) => {
			if (err) reject(new Error('Google API error'))
				const json = JSON.parse(body)
			
			if (json.status !== 'OK') reject(new Error('invalid location'))
				const route = json.routes[firstIndex].legs[firstIndex]
			
			resolve(route)
		})

	})

}