var http = require("http");
var fs = require("fs");
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
			response.end(data);
		}
	});
});

server.listen(8000);
