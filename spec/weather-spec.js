'use strict'

const fs = require('fs')
const rewire = require('rewire')
const forecast = rewire('../modules/weather')

const lat = 51.55571219999999
const lng = -1.7799789

describe('Check weather module returns accurate data', function() {


	forecast.__set__('apiCall', function(lat, lng) {

		return new Promise((resolve, reject) => {
			if (isNaN(lat) || isNaN(lng)) reject ('Invalid latitude and longitude')

			const data = fs.readFileSync('spec/weather/swindon_weather.json', 'utf8')

			const json = JSON.parse(data)

			resolve(json)

		})

	})

	it('Should return 8 hour forecast', function(done) {
		forecast.getForecast(lat,lng).then((data) => {
			const length = 8

			expect(data.hourly.data.length).toEqual(length)
			done()
		}).catch((error) => {
			console.log(error)
			done()
		})
	})

	it('Should return the current state of the weather', function(done) {
		forecast.getForecast(lat,lng).then((data) => {
			expect(data.currently.summary).toEqual('Clear')
			done()
		}).catch((error) => {
			console.log(error)
			done()
		})
	})

	it('Should throw an error if invalid data is passed', function(done) {
		const data = 1

		forecast.getForecast('One',data).catch((error) => {
			expect(error).toEqual('Invalid latitude and longitude')
			done()
		})
	})


})
