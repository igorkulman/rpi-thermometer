WebUI for a Raspberry Pi thermometer 
===============

WebUI for a Raspberry Pi thermometer writen in Node.js, measurring the temperature in the room.

![Raspberry Pi with the sensor](https://github.com/igorkulman/rpi-thermometer/raw/readme/rpib.png)

### Hardware

* Raspberry Pi
* DS18B20 temperature sensor
* RRU 4K7 resistor

### Software

* RaspBMC or Raspbian
* Node.js

### Drivers

* w1-gpio
* w1-therm

### Thermometer usage

First, load the drivers

```bash
sudo modprobe w1-gpio  
sudo modprobe w1-therm
```

then determine the device id of your sensor (28-000004e23e98 in my case) 

```bash
ls /sys/bus/w1/devices/   
```

open config.json and set the deviceId variable to your device id

```javascript
var deviceId="28-000004e23e98";
```

and run the server

```bash
node server.js
```

![Raspberry Pi temperature](https://github.com/igorkulman/rpi-thermometer/raw/readme/rpi.png)

### Recording and showing temperature

You can use the `/measure` endpoint to measure the current temperature and automatically write it to a sqlite3 db file. I suggest you add it to cron.

If you want to see the recorder temeprature chart, visist the `/history` endpoint.

![Raspbery Pi temperature history](https://github.com/igorkulman/rpi-thermometer/raw/readme/rpitemp.pngg)
