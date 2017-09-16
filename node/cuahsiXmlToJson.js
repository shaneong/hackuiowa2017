var http = require('http');

var options = {
  host: 'hiscentral.cuahsi.org',
  port: 80,
  path: '/webservices/hiscentral.asmx/GetSeriesMetadataCountOrData?getData=string&getFacetOnCV=string&xmin=string&xmax=string&ymin=string&ymax=string&sampleMedium=string&dataType=string&valueType=string&generalCategory=string&conceptKeyword=string&networkIDs=string&beginDate=string&endDate=string'
};

http.get(options, function(res) {
  console.log("Got response: " + res.statusCode);
  console.log(res);
  res.on("data", function(chunk) {
    console.log("BODY: " + chunk);
  });
}).on('error', function(e) {
  console.log("Got error: " + e.message);
});
