var express = require("express");
var exec = require("child_process").exec;
var cons = require("consolidate");

var deviceId="28-000004e23e98";

console.log("Starting");

var app = express();
app.engine("dust",cons.dust);

app.use(app.router);
app.use(express.static(__dirname+"/public"));
app.set("view engine", "dust");
app.set("views", __dirname + "/views");

app.get("/", function(request, response){
        	getTemperature(function(temp){
        		response.render("index", {
		    		temperature: temp
	     		});
        	});
});

app.get("/temperature", function(request, response){
        	getTemperature(function(temp){
        		response.send(temp.toString());
        	});
});


function getTemperature(callback){
	var child = exec("cat /sys/bus/w1/devices/"+deviceId+"/w1_slave", function (error, stdout, stderr) {
            var tempData = stdout.toString().split('\n')[1];
            var temp = parseInt(tempData.split("=")[1]) / 1000;
           	callback(temp);
           });
}

app.listen(8000);