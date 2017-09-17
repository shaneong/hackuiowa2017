const request = require('request');
const fs = require('fs');
var parse = require('csv-parse');
var brain = require('brain');
var net = new brain.NeuralNetwork();

var url = 'https://nwis.waterservices.usgs.gov/nwis/iv/?sites=05454500&format=json&parameterCd=00060,00065,00045&startDT=2006-01-01&endDT=2008-12-31';
var j = 0;
var precipitations = [];
var values = [];
var predictDataYearOne = [];
var predictDataYearTwo = [];
var predictDataYearThree = [];
var trainingOutput = [];
var dayOfYear = 1;


request(url, (error, response, body)=> {
    if (!error && response.statusCode === 200) {
        const json = JSON.parse(body);
        for(var i in json.value.timeSeries[0].values[0].value) {
            // console.log(JSON.stringify(json.value.timeSeries[0].values[0].value[i].value));
            if(JSON.stringify(json.value.timeSeries[0].values[0].value[i].dateTime).split('\"')[1].endsWith('12:00:00.000-06:00') ||
                    JSON.stringify(json.value.timeSeries[0].values[0].value[i].dateTime).split('\"')[1].endsWith('12:00:00.000-05:00')) { //
                values[j] = JSON.stringify(json.value.timeSeries[0].values[0].value[i].value).split('\"')[1] * 10 / 10;
                // console.log(j," " , JSON.stringify(json.value.timeSeries[0].values[0].value[i].dateTime));

                trainingOutput[j] = 0;

                if(values[j] > 8000) {
                    // console.log(values[j]);
                    trainingOutput[j] = 1;
                }
                j++;
            }
        }

        for(i in values) {
            if(dayOfYear > 365) {
                dayOfYear -= 365;
            } else {
                dayOfYear++;
            }
            if((i > 869 && i < 894) || trainingOutput[i] === 1 || precipitations[i] > 26) {
            //if(i > 0 && i < 1400) {
                predictDataYearOne.push({input: [dayOfYear, precipitations[i], values[i]], output: [5]});
            } else {
                predictDataYearOne.push({input: [dayOfYear, precipitations[i], values[i]], output: [0]});
            }
        }

        console.log(JSON.stringify(predictDataYearOne));

        net.train(predictDataYearOne, {
            errorThresh: 0.05,  // error threshold to reach
            iterations: 20000,   // maximum training iterations
            log: true,           // console.log() progress periodically
            logPeriod: 10,       // number of iterations between logging
            learningRate: 0.3    // learning rate
        });


        //for(var i = 0; i < 20000; i++) {
           var output = net.run([200, 1, 10000]); // [precipitation, river water depth]
           console.log('result: ', output[0]);
           // output = net.run([10, 10000]); // [precipitation, river water depth]
        //   console.log("tested data: 0.3, ", i)
           // console.log('result: ', output[0]);
        //}

    } else {
        console.log("Got an error: ", error, ", status code: ", response.statusCode);
    }
});

fs.readFile('./res/iowa_city_precipitation.csv', function (err, fileData) {
    parse(fileData, function(err, rows) {
        // Your CSV data is in an array of arrys passed to this callback as rows.
        for(var i in rows) {
            precipitations[i] = parseFloat(rows[i][1]);
        }
    });
})
