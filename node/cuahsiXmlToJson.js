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
      var parser = require('xml2json');      
      var json = parser.toJson(body);
      console.log(json);

  }
);

