'use strict';

const math = require('mathjs');

//Degrees to radinas

const deg2rad = angle => angle * Math.PI / 180;

//Lever arm errors after calibration flight (m)
const leverArm = [ 0, 0, 0 ];

//Boresight errors after calibration flight (degrees)
const deltaRoll = 0.005;
const deltaPitch = 0.005;
const deltaHeading = 0.008;

//Range offset (m)
const deltaR = 0.02;

//Scale mirror angle error (degrees)
const s = deg2rad(0.001);

//GNSS errors after processing with data from permanent stations
const gnssErrors = [0.04, 0.04, 0.04];

//INS errors from POS/AV specification
const insErrorRoll = deg2rad(0.013); //other values for POS/AV 210, 310, 410, 510 = 0.013, 0.008, 0.005
const insErrorPitch = deg2rad(0.013); //other values for POS/AV 210, 310, 410, 510 = 0.013, 0.008, 0.005
const insErrorHeading = deg2rad(0.035); //other values for POS/AV 210, 310, 410, 510 = 0.035, 0.015, 0.008

const calculateLaserVector = (range, scanAngle, rangeError, angleError) => {

    if(typeof rangeError === 'undefined') rangeError = 0;

    if(typeof angleError === 'undefined') angleError = 0;

    return [
        -(range + rangeError) * Math.sin(scanAngle + angleError),
        0,
        -(range + rangeError) * Math.cos(scanAngle + angleError)
    ];

};

const calculateRotationMatrix = (roll, pitch, heading, rollError, pitchError, headingError) => {

    if(typeof rollError === 'undefined') rollError = 0;

    if(typeof pitchError === 'undefined') pitchError = 0;

    if(typeof headingError === 'undefined') headingError = 0;

    const cosHeading = Math.cos(heading + headingError);
    const sinHeading = Math.sin(heading + headingError);
    const cosPitch = Math.cos(pitch + pitchError);
    const sinPitch = Math.sin(pitch + pitchError);
    const cosRoll = Math.cos(roll + rollError);
    const sinRoll = Math.sin(roll + rollError);

    const r1 = [
        cosHeading * cosPitch,
        cosHeading * sinPitch,
        - sinPitch
    ];

    const r2 = [
        cosHeading * sinPitch * sinRoll - sinHeading * cosRoll,
        sinHeading* sinPitch * sinRoll + cosHeading * cosRoll,
        cosPitch * sinRoll
    ];

    const r3 = [
        cosHeading * sinPitch * cosRoll + sinHeading * sinRoll,
        sinHeading * sinPitch * sinRoll - cosHeading * sinRoll,
        cosPitch * cosRoll
    ];

    return [r1, r2, r3];

};

const calculateCoordinates = (x0, y0, z0, roll, pitch, heading, mirrorAngle, range, applyErrors) => {

    if(applyErrors) {

        return math.add(
            math.add([x0, y0, z0], gnssErrors),
            math.multiply(calculateRotationMatrix(roll, pitch, heading, insErrorRoll, insErrorPitch, insErrorHeading), calculateLaserVector(range, mirrorAngle, deltaR, s))
        );

    } else {

        return math.add(
            [x0, y0, z0],
            math.multiply(calculateRotationMatrix(roll, pitch, heading), calculateLaserVector(range, mirrorAngle))
        );

    }

};

const coordinates = calculateCoordinates(1000, 1000, 1000, 0, deg2rad(0), deg2rad(0), deg2rad(15), 200 / Math.cos(deg2rad(15)), false).map(c => Math.round(c * 1000) / 1000);
console.log('W/o errors: ' + JSON.stringify(coordinates));

const coordinatesWithErrors = calculateCoordinates(1000, 1000, 1000, 0, deg2rad(0), deg2rad(0), deg2rad(15), 200 / Math.cos(deg2rad(15)), true).map(c => Math.round(c * 1000) / 1000);
console.log('With errors: ' + JSON.stringify(coordinatesWithErrors));

const difference = math.subtract(coordinatesWithErrors, coordinates);
console.log('Difference: ' + JSON.stringify(difference));


