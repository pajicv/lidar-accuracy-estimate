'use strict';

const math = require('mathjs');

const lidar = require('./lib/index');

const gnss = require('./lib/gnss');

const deg2rad = lidar.deg2rad;

/*const coordinates = lidar.calculatePoint(1000, 1000, 1000, 0, 0, 0, 200, 15, false);
console.log('W/o errors: ' + JSON.stringify(coordinates));

const coordinatesWithErrors = lidar.calculatePoint(1000, 1000, 1000, 0, 0, 0, 200, 15, true);
console.log('With errors: ' + JSON.stringify(coordinatesWithErrors));

const difference = math.subtract(coordinatesWithErrors, coordinates);
console.log('Difference: ' + JSON.stringify(difference));*/

const flightline = gnss.calculateFlightLine([1000, 1000, 1000], 50, 1000, 10000);

const scanAngles = gnss.calculateScanAngles(30, 1000, 50, 10000);

const coordinates = flightline.map((position, i) => lidar.calculatePoint(position[0], position[1], position[2], 0, 0, 0, 200, scanAngles[i], true) );
console.log('W/o errors: ' + JSON.stringify(coordinates));