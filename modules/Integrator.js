'use strict'

const directions = require('./directions')
const forecast = require('./weather')

/**
 * Integrator module.
 * @module Integrator
 */

/**
 * returns a promise resolving to either the JSON data for the travel-planner or an error
 * @param {string} origin - the starting location for the journey
 * @param {string} destination - the ending location for the journey
 * @returns {Promise} resolves JSON data for travel-planner or an error
 */

exports.getData = (origin, destination) => {
	

	return new Promise((resolve, reject) => {


		Promise.all([distance(origin, destination), duration(origin, destination), steps(origin, destination), weather(origin, destination)]).then( (values) => {


			let data

			data = { Distance: values[0], Duration: values[1], Directions: values[2], Weather : values[3]}

			resolve(data)

		}).catch((error) => {
			reject(error)
		})


	})

	


}

/**
 * returns a promise resolving to either the hourly weather data for the travel-planner or an error
 * @param {string} origin - the starting location for the journey
 * @param {string} destination - the ending location for the journey
 * @returns {Promise} resolves the hourly weather data for travel-planner or an error
 */

function weather(origin, destination){ 
	return new Promise((resolve, reject) => {
		directions.getCoordinates(origin, destination).then((result) => {

			forecast.getForecast(result.lat, result.lng).then((result) => {

				resolve(result)

			}).catch((error) => {
				reject(error)
			})


		}).catch((error) => {
				reject(error)
			})
	})

}


/**
 * returns a promise resolving to the distance between origin and destination or an error
 * @param {string} origin - the starting location for the journey
 * @param {string} destination - the ending location for the journey
 * @returns {Promise} resolves to the distance between origin and destination or an error
 */

function distance(origin, destination){
	return new Promise((resolve, reject) => {
		 directions.getDistance(origin, destination).then((result) => {

				resolve(result)

			}).catch((error) => {
				reject(error)
			})
		})

}

/**
 * returns a promise resolving to the duration between origin and destination or an error
 * @param {string} origin - the starting location for the journey
 * @param {string} destination - the ending location for the journey
 * @returns {Promise} resolves to the duration between origin and destination or an error
 */

function duration(origin, destination){
	return new Promise((resolve, reject) => {
		directions.getDuration(origin, destination).then((result) => {

				resolve(result)

			}).catch((error) => {
				reject(error)
			})	

	})

}

/**
 * returns a promise resolving to an array of steps between origin and destination or an error
 * @param {string} origin - the starting location for the journey
 * @param {string} destination - the ending location for the journey
 * @returns {Promise} resolves to an array of steps between origin and destination or an error
 */

function steps(origin, destination){ 
	return new Promise((resolve, reject) => {
	directions.getDirections(origin, destination).then((result) => {

			resolve(result)

		}).catch((error) => {
			reject(error)
		})	

	})

}