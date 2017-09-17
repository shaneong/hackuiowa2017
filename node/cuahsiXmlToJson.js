var request = require('request');
var http = require('http');

var jsonData = '';


/* getting data */

var options = {
  url: 'http://hiscentral.cuahsi.org/webservices/hiscentral.asmx/GetSites',
  method: 'POST',
  qs: {
    xmin: 10,
    xmax: 100,
    ymin: 10,
    ymax: 100,
  }
};

// request(options, function(err, res, body) {
//   console.log(options)
//   console.log(body);
// });

request.post(
  'http://hiscentral.cuahsi.org/webservices/hiscentral.asmx/GetSites',
  { form: {
    xmin: '-92.298128',
    xmax: '-91.506265',
    ymin: '41.609206',
    ymax: '42.443278',
    conceptKeyword: '',
    networkIDs: '',
    beginDate: '2000-01-01',
    endDate: '2010-12-31'
  } },
  function (error, response, body) {
      var parser = require('xml-js');
      var json = parser.xml2json(body, {compact: false, spaces: 2 });
      jsonData = json;
      // console.log(json);


  }
);

// request.post(
//   'http://hiscentral.cuahsi.org/webservices/hiscentral.asmx/GetSeriesMetadataCountOrData',
//   { form: {
//     getData: false,
//     getFacetOnCV: true,
//
//     xmin: '-92.298128',
//     xmax: '-91.506265',
//     ymin: '41.609206',
//     ymax: '42.443278',
//     sampleMedium: '',
//     dataType: '',
//     valueType: '',
//     generalCategory: '',
//     conceptKeyword: '',
//     networkIDs: '',
//     beginDate: '',
//     endDate: ''
//   } },
//   function (error, response, body) {
//       var parser2 = require('xml-js');
//       var json = parser2.xml2json(body, {compact: false, spaces: 2 });
//       // console.log(json);
//       jsonData = json;
//   }
// );
//
// request.post(
//   'https://waterservices.usgs.gov/nwis/iv/',
//   { form: {
//     sites: '01646500'
//   } },
//   function (error, response, body) {
//     // console.log(body);
//     var parser2 = require('xml-js');
//     var json = parser2.xml2json(body, {compact: false, spaces: 2 });
//     console.log(json);
//   }
// );


/* server running */
server = http.createServer(function(request, response) {
    response.writeHead(200, {"Content-Type": "application/json"});
    response.end(jsonData);
});
server.listen(8000);
