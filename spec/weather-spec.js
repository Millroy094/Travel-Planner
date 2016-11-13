'use strict'

const fs = require('fs')
const rewire = require('rewire')
const forecast = rewire('../modules/weather')

const initial = 0
const max = 8

describe('Check weather module returns accurate data', function() {


	forecast.__set__('apiCall', function(lat, lng) {

		return new Promise((resolve, reject) => {

			const data = fs.readFileSync('spec/weather/swindon_weather.json', 'utf8')

			const json = JSON.parse(data)
			const weather = json

			let hourly =[]

			/* Loops through hourly weather data to get 8 hour data  */

			for (let i=initial; i<max; i++){
				hourly.push(weather.hourly.data[i])	

			}

			weather.hourly.data = hourly

			resolve(weather)

		})

	})

	it('Should return 8 hour forecast', function (done) {
		forecast.getForecast(51.55571219999999,-1.7799789).then((data)=>{
			expect(data.hourly.data.size()).toEqual(8)
			done()
		}).catch((error)=>{
			console.log(error)
			done()
		})
	})


})
