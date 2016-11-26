'use strict'

const fs = require('fs')
const rewire = require('rewire')
const forecast = rewire('../modules/weather')

const initial = 0
const max = 8

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
		forecast.getForecast(51.55571219999999,-1.7799789).then((data) => {
			expect(data.hourly.data.length).toEqual(8)
			done()
		}).catch((error) => {
			console.log(error)
			done()
		})
	})

	it('Should return the current state of the weather', function(done) {
		forecast.getForecast(51.55571219999999,-1.7799789).then((data) => {
			expect(data.currently.summary).toEqual('Clear')
			done()
		}).catch((error) => {
			console.log(error)
			done()
		})
	})

	it('Should throw an error if invalid data is passed', function(done) {
		forecast.getForecast('One',1).catch((error) => {
			expect(error).toEqual('Invalid latitude and longitude')
			done()
		})
	})


})
