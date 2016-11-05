'use strict'

const readline = require('readline-sync')
const tripPlannerApi = require('./modules/integrator')

const origin = String(readline.question('start address: ')).trim()
const destination = String(readline.question('Destination address: ')).trim()


tripPlannerApi.getData(origin, destination, (err, data) => {
	try {
		if (err) throw err
		console.log(data)
	} catch(err) {
		console.log(`ERROR: ${err.message}`)
	}
})





console.log('EOF')