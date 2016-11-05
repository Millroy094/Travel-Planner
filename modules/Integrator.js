'use strict'

const directions = require('./directions')
const forecast = require('./weather')



exports.getData = (origin, destination, callback) => {
	
	try{

		let data 
		let distance
		let duration
		let steps = []
		let hourly_forcast = []

	

		directions.getDistance(origin, destination, (err, dist) => {
			try {
				if (err) throw err
				distance = dist				
			} catch(err) {
				console.log(`ERROR: ${err.message}`)
			}
		})

		directions.getDuration(origin, destination, (err, dur) => {
			try {
				if (err) throw err
				duration = dur
			} catch(err) {
				console.log(`ERROR: ${err.message}`)
			}
		})

		directions.getDirections(origin, destination, (err, st) => {
			try {
				if (err) throw err
				steps = st
						
			} catch(err) {
				console.log(`ERROR: ${err.message}`)
			}
		})

		directions.getCoordinates(origin, destination, (err, lat, lng) => {
			
			let longitude
			let latitude

			try {
				if (err) throw err

				longitude=lng
				latitude=lat

				forecast.getForecast(latitude,longitude, (err, weather) => {

					try {
						
						if (err) throw err

						hourly_forcast = weather


					} catch(err) {
						console.log(`ERROR: ${err.message}`)
					}
				})

						
			} catch(err) {
				console.log(`ERROR: ${err.message}`)
			}
		})

		data = {origin, destination, distance, duration, steps, hourly_forcast }
		return callback(null, data)
	} catch(err){
		console.log(`ERROR: ${err.message}`)
	}

}
