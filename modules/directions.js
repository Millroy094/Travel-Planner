
'use strict'

/**
 * directions module.
 * @module directions
 */

const request = require('request')
const replaceAll = require('replaceall')
const APIKey = 'AIzaSyBgpCjYQpQ5lYDDKa_fu3Hwuoh1LyXMazY'


/**
 * returns the driving distance between two locations
 * @function getDistance
 * @param {string} origin - the starting location for the journey
 * @param {string} destination - the ending location for the journey
 * @returns {Promise} resolves the distance from origin to destination
 */
exports.getDistance = (origin, destination) => new Promise((resolve, reject) => {

	apiCall(origin, destination).then((result) => refineData(result)).then((result) => {
		resolve(result.distance.text)
	}).catch((error) => {
		reject(error)
	})

})

/**
 * returns the driving duration between two locations
 * @function getDuration
 * @param {string} origin - the starting location for the journey
 * @param {string} destination - the ending location for the journey
 * @returns {Promise} resolves the distance from origin to destination
 */
exports.getDuration = (origin, destination) => new Promise((resolve, reject) => {

	apiCall(origin, destination).then((result) => refineData(result)).then((result) => {
		resolve(result.duration.text)
	}).catch((error) => {
		reject(error)
	})

})

/**
 * returns the lattitude and longitude of the location
 * @function getCoordinates
 * @param {string} origin - the starting location for the journey
 * @param {string} destination - the ending location for the journey
 * @returns {Promise} resolves the coordinates of the destination
 */
exports.getCoordinates = (origin, destination) => new Promise((resolve, reject) => {

	apiCall(origin, destination).then((result) => refineData(result)).then((result) => {
		resolve(result.end_location)
	}).catch((error) => {
		reject(error)
	})

})


/**
 * returns the driving steps between two locations
 * @function getDirections
 * @param {string} origin - the starting location for the journey
 * @param {string} destination - the ending location for the journey
 * @returns {Promise} resolves an array of directions
 */
exports.getDirections = (origin, destination) => new Promise((resolve, reject) => {

	apiCall(origin, destination).then((result) => refineData(result)).then((result) => {

		let steps = []

		/* Loops through all the directions and puts it into the steps list */

		steps.push('Directions to get there:')

		for (const step in result.steps){
			steps.push(result.steps[step].html_instructions)
		}

		/* Refines the directions to hold pure instructions */

		steps = steps.map(item => replaceAll('<b>', '', item))
				.map(item => replaceAll('</b>', '', item))
				.map(item => replaceAll('<div style="font-size:0.9em">', '', item))
				.map(item => replaceAll('</div>', '', item))

		resolve(steps)

	}).catch((error) => {
		reject(error)
	})

})

/**
* This function returns the JSON directions data from the search
* @function apiCall
* @param {string} origin - the starting location for the journey
* @param {string} destination - the ending location for the journey
* @returns {Promise} resolves to an Json object containing data about route or rejects for an error
*/
function apiCall(origin, destination) {
	return new Promise((resolve, reject) => {

		const url = `https://maps.googleapis.com/maps/api/directions/json?region=gb&origin=${origin}&destination=${destination}&key=${APIKey}`


		request.get(url, (err, res, body) => {
			if (err) reject(new Error('Google API error'))
			const json = JSON.parse(body)

			resolve(json)

		})

	})

}

/**
 * @function refineData
 * @param {string} data - represents direction data from origin to destination
 * @returns {Promise} resolves to an Json object containing data about route or rejects for an error
 */
function refineData(data) {
	return new Promise((resolve, reject) => {
		const firstIndex = 0

		if (data.status !== 'OK' ) reject(new Error('Invalid location'))

		else {
			const route = data.routes[firstIndex].legs[firstIndex]

			resolve(route)
		}

	})


}


