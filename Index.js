'use strict'

const readline = require('readline-sync')
const directions = require('./modules/directions')
const forecast = require('./modules/weather')


const origin = String(readline.question('start address: ')).trim()
const destination = String(readline.question('Destination address: ')).trim()
let longitude
let latitude

directions.getDistance(origin, destination, (err, distance) => {
	try {
		if (err) throw err
		console.log(distance)
	} catch(err) {
		console.log(`ERROR: ${err.message}`)
	}
})

directions.getDuration(origin, destination, (err, duration) => {
	try {
		if (err) throw err
		console.log(duration)
	} catch(err) {
		console.log(`ERROR: ${err.message}`)
	}
})


directions.getDirections(origin, destination, (err, steps) => {
	try {
		if (err) throw err
		for (let step in steps){
			console.log(steps[step])
		}
				
	} catch(err) {
		console.log(`ERROR: ${err.message}`)
	}
})

directions.getCoordinates(origin, destination, (err, lat, lng) => {
	try {
		if (err) throw err

		longitude=lng
		latitude=lat

		forecast.getForecast(latitude,longitude, (err, weather) => {

			try {
				
				if (err) throw err

				console.log(weather)

			} catch(err) {
				console.log(`ERROR: ${err.message}`)
			}
		})

				
	} catch(err) {
		console.log(`ERROR: ${err.message}`)
	}
})



console.log('EOF')