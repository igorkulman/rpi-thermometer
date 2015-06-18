var express = require("express");
var mustacheExpress = require('mustache-express');
var fs = require("fs");
var Synergykit = require("synergykit");
var rpiTemp = require('rpi-temp-module');

var config = JSON.parse(fs.readFileSync(__dirname+"/config.json"));
var deviceId = config.deviceId;
var port = config.port;

Synergykit.Init(config.synergyKitAppUrl, config.synergyKitKey, {
    debug: false 
});

console.log("Starting");

var app = express();
app.engine('html', mustacheExpress());
app.use(app.router);
app.use(express.static(__dirname + "/public"));
app.set("view engine", "html");
app.set("views", __dirname + "/views");

app.get("/", function(request, response) {
    rpiTemp.getTemperature(deviceId, function(temp) {
        response.render("index", {
            temperature: temp
        });
    });
});

app.get("/temperature", function(request, response) {
    rpiTemp.getTemperature(deviceId, function(temp) {
        response.send(temp.toString());
    });
});

app.get("/history", function(request, response) {
    var interval = request.param('timeinterval');
    if (interval == undefined) {
        interval = "24";
    }

    var temps = Synergykit.Data("Temperature");
    var query = Synergykit.Query(temps);

    var myDate = new Date();
    myDate.setHours(myDate.getHours() - parseInt(interval));

    query.where()
        .attribute("createdAt")
        .isGreaterThan(myDate.getTime())
        .find({
            success: function(rows, statusCode) {
                response.render("history", {
                    data: rows,
                    is24: interval == "24",
                    is6: interval == "6",
                    is12: interval == "12",
                    is168: interval == "168",
                    is720: interval == "720"
                })
            },
            error: function(error, statusCode) {
                response.send("error")
            }
        })
});

app.get("/measure", function(request, response) {

    rpiTemp.getTemperature(deviceId, function(temp) {
        var record = Synergykit.Data("Temperature");
        record.set("value", temp);

        record.save({
            success: function(data, statusCode) {
                response.send("ok: " + temp.toString());
            },
            error: function(error, statusCode) {
                response.send("fail");
            }
        });


    });
});

app.listen(port);
