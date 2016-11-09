'use strict'

const request = require('request')

/**
 * weather module.
 * @module weather
 */


// appid is the API key for Forcaste.IO
const appid = '82aea3af796e9d2b3818f9688c420fa5'

/**
 * @param {string} lat - represents the latitude of the destination
 * @param {string} lng - represents the longitude of the destination
 * @returns {Promise} resolves to a JSON weather object or rejects for an error
 */

exports.getForecast = (lat, lng) => {
	
	return new Promise((resolve, reject) => {

		apiCall(lat, lng).then((result) => {
			resolve(result)
		}).catch((error) => {
			reject(error)
		})

	})


}


/**
 * @function apiCall
 * @param {string} lat - represents the latitude of the destination
 * @param {string} lng - represents the longitude of the destination
 * @returns {Promise} resolves to a JSON weather object or rejects for an error
 */
function apiCall(lat, lng) {
	return new Promise((resolve, reject) => {
		const firstIndex = 0
		const url = `https://api.darksky.net/forecast/${appid}/${lat},${lng}`
		console.log(url)
		request.get(url, (err, res, body) => {
			if (err) reject(new Error('Forcast.IO error'))
			const json = JSON.parse(body)
			const weather = json.hourly
			resolve(weather)
		})
	})
	
	 
	

}