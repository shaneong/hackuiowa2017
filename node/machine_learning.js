const request = require('request');
const fs = require('fs');
var parse = require('csv-parse');


var brain = require('brain');
var net = new brain.NeuralNetwork();


var url = 'https://nwis.waterservices.usgs.gov/nwis/iv/?sites=05454500&format=json&parameterCd=00060,00065&startDT=2006-01-01&endDT=2008-12-31';


var html = '';
var sum = 0;
var j = 0;
var precipitations = [];
var values = [];
var predictData = [];


request(url, (error, response, body)=> {
    if (!error && response.statusCode === 200) {
        const json = JSON.parse(body);
        for(var i in json.value.timeSeries[0].values[0].value) {
            // values.push(JSON.stringify(json.value.timeSeries[0].values[0].value[i].value));
            if(JSON.stringify(json.value.timeSeries[0].values[0].value[i].dateTime).split('\"')[1].endsWith('12:00:00.000-06:00') ||
                    JSON.stringify(json.value.timeSeries[0].values[0].value[i].dateTime).split('\"')[1].endsWith('12:00:00.000-05:00')) { //
                values[j] = JSON.stringify(json.value.timeSeries[0].values[0].value[i].value).split('\"')[1] * 10 / 10;
                // console.log(JSON.stringify(json.value.timeSeries[0].values[0].value[i].dateTime));
                // console.log(values[j]);
                j++;
            }
        }

        for(i in values) {
            var obj = {};
            // console.log(precipitations[i]);
            obj.input = precipitations[i];

            // console.log(values[i]);
            obj.output = values[i];
            predictData.push(obj);
        }

        // console.log(JSON.stringify(predictData));

        var trainStream = net.createTrainStream({
            /**
            * Write training data to the stream. Called on each training iteration.
            */
            floodCallback: function() {
                flood(trainStream, predictData);
                console.log("training...");
            },

            /**
            * Called when the network is done training.
            */
            doneTrainingCallback: function(obj) {
                console.log("trained in " + obj.iterations + " iterations with error: "
                            + obj.error);

                var result = net.run(12);

                console.log("Result: ", result);  // 0.987
            }
        });

                // kick it off
        flood(trainStream, predictData);


        function flood(stream, data) {
          for (var i = 0; i < data.length; i++) {
            // stream.write(data[i]);
          }
          // let it know we've reached the end of the data
          // stream.write(null);
        }

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

//
// var url = 'https://nwis.waterservices.usgs.gov/nwis/iv/?sites=05454500&format=json&parameterCd=00060,00065&startDT=2006-11-22&endDT=2008-12-22';
//
// for(var i in json.value.timeSeries[0].values[0].value) {
//     html += JSON.stringify(json.value.timeSeries[0].values[0].value[i].value);
//     html += '\n';
//     // values.push(JSON.stringify(json.value.timeSeries[0].values[0].value[i].value));
//     numberHolder = JSON.stringify(json.value.timeSeries[0].values[0].value[i].value);
//     sum += numberHolder;
//     j++
//     if(j === 45) {
//         j = 0;
//         values[i] = sum / 46;
//         sum = 0;
//     }
// }
//
// $('#json').html(html);
