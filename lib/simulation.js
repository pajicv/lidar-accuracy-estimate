/**
 * Created by pajicv on 2/14/18.
 */

'use strict';

const math = require('mathjs');

const range = (start, end) => Array.from({length: (end - start)}, (v, k) => k + start);

module.exports = {

    calculateFlightLine: (initialPosition, velocity, pointFrequency, numberOfPoints) => {

        const positionAlongLine = i => [initialPosition[0],
            initialPosition[1] + i * (velocity / pointFrequency),
            initialPosition[2]];

        return range(0, numberOfPoints).map(positionAlongLine);

    },

    calculateScanAngles: (maxScanAngle, pointFrequency, lineFrequency, numberOfPoints) => {

        const pointsPerLine = Math.floor(pointFrequency / lineFrequency);

        const numberOfFullLines = numberOfPoints / pointsPerLine;

        let scanAngles = range(0, numberOfFullLines).map(l => range(0, pointsPerLine).map(i => - maxScanAngle + i * ( 2 * maxScanAngle / pointsPerLine)));

        scanAngles.push(range(0, numberOfPoints - numberOfFullLines * pointsPerLine).map(i => - maxScanAngle + i * ( 2 * maxScanAngle / pointsPerLine)));

        return [].concat(...scanAngles);
    }

};