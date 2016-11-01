'use strict'

const request = require('request')

/**
 * weather module.
 * @module weather
 */
/**
 * Callback used by apiCall
 * @callback apiCallback
 * @param {error} err - error returned (null if no error)
 * @param {data} route - the data returned as an object
 */


const appid = 'e219b3ff10070ceb05a8a84a8416ff53'


exports.getForecast = (destination, callback) => {
	apiCall(destination, (err, weather) => {
		if (err) return callback(err)
		return callback(null, `Weather is ${weather}`)
	})
}


/**
 * @function apiCall
 * @param {string} destination - the ending location for the journey
 * @param {apiCallback} callback - the callback run when api call is completed
 * @returns {null} no return value
 */
function apiCall(destination, callback) {
	const firstIndex = 0
	const url = `http://api.openweathermap.org/data/2.5/find?q=${destination}&units=metric&appid=${appid}`
	console.log(url)
	request.get(url, (err, res, body) => {
		if (err) return callback(new Error('Open weather map error'))
		const json = JSON.parse(body)
		if (json.status !== 'OK') return callback(new Error('invalid location'))
		const weather = json.weather[firstIndex].description
		console.log(weather)
		return callback(null, weather)
	})
}