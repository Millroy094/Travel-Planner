'use strict'

const directions = require('./directions')
const forecast = require('./weather')



exports.getData = (origin, destination) => {
	

	return new Promise((resolve, reject) => {


		Promise.all([distance(origin, destination), duration(origin, destination), steps(origin, destination), weather(origin, destination)]).then( (values) => {

			console.log(values)
		}).catch((error) => {
			reject(error)
		})


	})

	


}

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

function distance(origin, destination){
	return new Promise((resolve, reject) => {
		 directions.getDistance(origin, destination).then((result) => {

				resolve(result)

			}).catch((error) => {
				reject(error)
			})
		})

}

function duration(origin, destination){
	return new Promise((resolve, reject) => {
		directions.getDuration(origin, destination).then((result) => {

				resolve(result)

			}).catch((error) => {
				reject(error)
			})	

	})

}

function steps(origin, destination){ 
	return new Promise((resolve, reject) => {
	directions.getDirections(origin, destination).then((result) => {

			resolve(result)

		}).catch((error) => {
			reject(error)
		})	

	})

}