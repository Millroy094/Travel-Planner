'use strict'

const readline = ('readline-sync')
const directions = ('./modules/directions')
const forecast = ('./modules/weather')


const origin = String(readline.question('start address: ')).trim()
const destination = String(readline.question('Destination address: ')).trim()


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
			console.log(step)
		}
				
	} catch(err) {
		console.log(`ERROR: ${err.message}`)
	}
})



forecast.getForecast(destination, (err, data) => {

	try {
		if (err) throw err
			console.log(data)

	} catch(err) {
		console.log('ERROR: ${err.message}')
	}



})

console.log('EOF')