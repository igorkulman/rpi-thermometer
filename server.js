var http = require("http");
var fs = require("fs");
var exec = require('child_process').exec;

console.log("Starting");

var server = http.createServer(function(request, response) {
	console.log("Received request: "+request.url);
	var filename = request.url;
	if (filename=="/"){
		filename="/index.html";
	}
	fs.readFile("./public"+filename, function(error, data){
		if (error){
			response.writeHead(404);
			response.end();
		} else {
			response.writeHead(200);
			if (filename=="/index.html"){
				 var child = exec("cat ./fake.data", function (error, stdout, stderr) {
				 	var tempData = stdout.toString().split('\n')[1];
				 	var temp = parseInt(tempData.split('=')[1]) / 1000;
				 	response.end(data.toString().replace("TEMP",temp));
				});
			} else {
				response.end(data);
			}
		}
	});
});

server.listen(8000);
