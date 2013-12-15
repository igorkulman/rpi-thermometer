WebUI for a Raspberry Pi thermometer 
===============

WebUI for a Raspberry Pi thermometer writen in Node.js, measurring the temperature in the room.

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

### Usage

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