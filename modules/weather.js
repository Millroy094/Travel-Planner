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


const appid = '82aea3af796e9d2b3818f9688c420fa5'


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
 * @param {string} destination - the ending location for the journey
 * @param {apiCallback} callback - the callback run when api call is completed
 * @returns {null} no return value
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