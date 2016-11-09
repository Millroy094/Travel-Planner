
'use strict'
/**
 * directions module.
 * @module directions
 */

const request = require('request')
const replaceAll = require('replaceall')

/**
 * returns the driving distance between two locations
 * @param {string} origin - the starting location for the journey
 * @param {string} destination - the ending location for the journey
 * @returns {Promise} resolves the distance from origin to destination
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
 * @returns {Promise} resolves the distance from origin to destination
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
 * @returns {Promise} resolves the coordinates of the destination
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
 * @returns {Promise} resolves an array of directions 
 */

exports.getDirections = (origin, destination) => {

	return new Promise((resolve, reject) => {

		apiCall(origin, destination).then((result) => {
			const steps = []
			steps.push("Directions to get there:")
			
			for (let step in result.steps){	
				steps.push(replaceAll("</div>", "", replaceAll('<div style="font-size:0.9em">', "", replaceAll("</b>", "",replaceAll("<b>", "",result.steps[step].html_instructions)))))
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
 * @returns {Promise} resolves to an Json object containing data about route or rejects for an error
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