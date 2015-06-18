var fs = require("fs");
var Synergykit = require("synergykit");
var rpiTemp = require('rpi-temp-module');

var config = JSON.parse(fs.readFileSync(__dirname +"/config.json"));
var deviceId = config.deviceId;

Synergykit.Init(config.synergyKitAppUrl, config.synergyKitKey, {
    debug: false 
});

rpiTemp.getTemperature(deviceId, function(temp) {
        var record = Synergykit.Data("Temperature");
        record.set("value", temp);

        record.save({
            success: function(data, statusCode) {
                console.log("ok: " + temp.toString());
            },
            error: function(error, statusCode) {
                console.log("fail");
            }
        });


    });
