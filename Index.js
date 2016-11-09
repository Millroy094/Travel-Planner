'use strict'

const readline = require('readline-sync')
const tripPlannerApi = require('./modules/integrator')

const origin = String(readline.question('start address: ')).trim()
const destination = String(readline.question('Destination address: ')).trim()


tripPlannerApi.getData(origin, destination).then((result)=>{

	console.log(result)

}).catch((error) => {
	console.log(error)
})



console.log('EOF')