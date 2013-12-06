var express = require("express");
var fs = require("fs");
var exec = require('child_process').exec;

console.log("Starting");

var app = express();

app.use(app.router);
app.use(express.static(__dirname+"/public"));

app.get("/", function(request, response){
    fs.readFile("./public/index.html", function(error, data){
        var child = exec("cat ./fake.data", function (error, stdout, stderr) {
            var tempData = stdout.toString().split('\n')[1];
            var temp = parseInt(tempData.split('=')[1]) / 1000;
            response.send(data.toString().replace("TEMP",temp));
        });
    });
});

app.listen(8000);
