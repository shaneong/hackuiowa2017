var request = require('request');

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
    xmin: '10',
    xmax: '100',
    ymin: '10',
    ymax: '100',
    conceptKeyword: '',
    networkIDs: '',
    beginDate: '',
    endDate: ''
  } },
  function (error, response, body) {
      var parser = require('xml-js');
      var json = parser.xml2json(body, {compact: false, spaces: 2 });
      console.log(json);
  }
);

request.post(
  'http://hiscentral.cuahsi.org/webservices/hiscentral.asmx/GetSeriesMetadataCountOrData',
  { form: {
    getData: true,
    getFacetOnCV: true,
    xmin: '10',
    xmax: '100',
    ymin: '10',
    ymax: '100',
    sampleMedium: '',
    dataType: '',
    valueType: '',
    generalCategory: '',
    conceptKeyword: '',
    networkIDs: '',
    beginDate: '',
    endDate: ''
  } },
  function (error, response, body) {
      var parser2 = require('xml-js');
      var json = parser2.xml2json(body, {compact: false, spaces: 2 });
      console.log(json);
  }
);

request.post(
  'https://waterservices.usgs.gov/nwis/iv/',
  { form: {
    sites: '01646500'
  } },
  function (error, response, body) {
    // console.log(body);
    var parser2 = require('xml-js');
    var json = parser2.xml2json(body, {compact: false, spaces: 2 });
    console.log(json);
  }
);
