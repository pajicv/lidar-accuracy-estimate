'use strict';

const math = require('mathjs');

const fs = require('fs');

const lidar = require('./lib/index');

const gnss = require('./lib/gnss');

const coordinatesToCsv = coordinates => coordinates.map(c => c.join(',')).join('\n');

const flightline = gnss.calculateFlightLine([1000, 1000, 1000], 50, 1000, 10000);

const scanAngles = gnss.calculateScanAngles(30, 1000, 50, 10000);

const coordinates = flightline.map((position, i) => lidar.calculatePoint(position[0], position[1], position[2], 0, 0, 0, 200, scanAngles[i], false) );

const coordinatesWithErrors = flightline.map((position, i) => lidar.calculatePoint(position[0], position[1], position[2], 0, 0, 0, 200, scanAngles[i], true) );

const difference = math.subtract(coordinatesWithErrors, coordinates);

fs.writeFile('./output/coordinates.xyz', coordinatesToCsv(coordinates), (err, result) => !!err ? console.log(result) : console.log(err));

fs.writeFile('./output/coordinatesWithErrors.xyz', coordinatesToCsv(coordinatesWithErrors), (err, result) => !!err ? console.log(result) : console.log(err));

fs.writeFile('./output/difference1.csv', coordinatesToCsv(difference), (err, result) => !!err ? console.log(result) : console.log(err));