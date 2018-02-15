'use strict';

const math = require('mathjs');

const fs = require('fs');

const lidar = require('./lib/lidar');

const gnss = require('./lib/simulation');

const coordinatesToCsv = coordinates => coordinates.map(c => c.join(',')).join('\n');

const flightline = gnss.calculateFlightLine([1000, 1000, 1000], 50, 1000, 10000);

const scanAngles = gnss.calculateScanAngles(30, 1000, 50, 10000);

const coordinates = flightline.map((position, i) => lidar.calculatePoint(position[0], position[1], position[2], 0, 0, 0, 200, scanAngles[i], false) );

const coordinatesWithErrors = flightline.map((position, i) => lidar.calculatePoint(position[0], position[1], position[2], 0, 0, 0, 200, scanAngles[i], true) );

const difference = math.subtract(coordinatesWithErrors, coordinates);

const writeFileCallback = (err, result) => !err ? console.log(result) : console.log(err);

fs.writeFile('./output/coordinates.xyz', coordinatesToCsv(coordinates), writeFileCallback);

fs.writeFile('./output/coordinatesWithErrors.xyz', coordinatesToCsv(coordinatesWithErrors), writeFileCallback);

fs.writeFile('./output/difference1.csv', coordinatesToCsv(difference), writeFileCallback);